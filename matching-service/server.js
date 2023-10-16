const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const socketioJwt = require('socketio-jwt');
const { v4: uuidv4 } = require('uuid');
// To keep track of active rooms
const rooms = new Map();
// To keep track of users connected to socket
const users = new Map();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3002'],
  },
});

server.listen(3002, () => {
  console.log('Server is listening on port 3002');
});

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api/room/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const roomInfo = rooms.get(roomId);
  console.log("rooms data: ", rooms);

  // Check if the room is still active
  if (rooms.has(roomId)) {
    const questionId = roomInfo.questionId;
    fetch(`http://localhost:3000/api/questions/${questionId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        res.json(responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: 'Error fetching data from external API' });
      });
  } else {
    // Room not found, throw 404 error to api request
    res.status(404).send('Room not found');
  }
});

const waitingQueue = [];

const userNamespace = io.of("/users");

// Middleware to authenticate users using JWT token
// Can check token validity here
io.use(socketioJwt.authorize({
  secret: 'secret', // Replace with your actual JWT secret key
  handshake: true,
}));

io.on('connection', async (socket) => {
  console.log('A user connected');
  console.log('Authenticated user connected:', socket.decoded_token);
  
  socket.on('match me', (selectedDifficulty, selectedTopic, selectedLanguage) => {
    const userId = socket.decoded_token.id; // Assuming user ID is in the token

    if (waitingQueue.find(user => user.userId === userId)) {
      console.log('User is already in the queue and cannot self-match.');
    } else {
      // Check if a match is found with another user
      const matchingUserIndex = waitingQueue.findIndex(
        (user) => user.selectedDifficulty === selectedDifficulty && user.selectedTopic === selectedTopic && user.selectedLanguage == selectedLanguage
      );
  
      if (matchingUserIndex !== -1) {
        console.log('User match!');
        const user1 = waitingQueue.splice(matchingUserIndex, 1)[0];
        startMatch(user1, socket, selectedDifficulty, selectedTopic, selectedLanguage);
      } else {
        console.log('No user found');
        socket.userId = userId;
        socket.selectedDifficulty = selectedDifficulty;
        socket.selectedTopic = selectedTopic;
        socket.selectedLanguage = selectedLanguage;
        waitingQueue.push(socket);
        // waitingQueue.set(userId, { socket, selectedDifficulty, selectedTopic, selectedLanguage });
      }
    }
  });

  socket.on('cancel match', () => {
    const index = waitingQueue.indexOf(socket);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
      console.log('Matching canceled by user');
      socket.emit('match canceled');
    }
  });

  // Listen for the 'joinRoom' event from the client
  socket.on('joinRoom', (roomId) => {
    // Check if the user is not joining a room with themselves
    if (socket.id !== roomId) {
      socket.join(roomId);
      socket.to(roomId).emit("userConnected");
    }
  });

  // Listen for the 'codeChange' event from the client
  socket.on('codeChange', (newCode, roomId) => {
    console.log('emit codechange from server');

    // Check if the sender belongs to the same room
    if (socket.rooms.has(roomId)) {
      // Broadcast the code change only to sockets in the same room
      io.to(roomId).emit('codeChange', newCode);
    }
  });

  // Listen for the 'sendMessage' event from the client
  socket.on('sendMessage', (data) => {
    console.log('emit receiveMessage from server');
    // Check if the sender belongs to the same room
    if (socket.rooms.has(data.roomId)) {
      // Broadcast the code change only to sockets in the same room
      io.to(data.roomId).emit('receiveMessage', data);
    }
  });

  socket.on('userTyping', (roomId, isTyping) => {
    socket.to(roomId).emit('userTyping', isTyping);
  });

  // Listen for the 'disconnect' event from the client
  socket.on('disconnect', () => {
    console.log('A user disconnected');

    // Search for the room this socket disconnected from
    for (const [roomId, roomInfo] of rooms.entries()) {
      // Compare socketid with user1Id and user2Id
      if (socket.id === roomInfo.user1Id || socket.id === roomInfo.user2Id) {
        socket.to(roomId).emit('userDisconnected');
        socket.leave(roomId);
        
        if (rooms.delete(roomId)) {
          console.log("Removed room with ID", roomId, "from rooms map.");
        } else {
          console.log("Room with ID", roomId, "not found in rooms map.");
        }
        break; // Guard clause
      }
    }
    socket.leave();
  });

  socket.on('timerEnd', (roomId) => {
    console.log("The time has ended");
    // Check if the user is in the specified room
    if (rooms.has(roomId)) {
      if (rooms.delete(roomId)) {
        console.log("Removed room with ID", roomId, "from rooms map.");
      } else {
        console.log("Room with ID", roomId, "not found in rooms map.");
      } 
    }
    socket.leave(roomId);
  });
  
  // Disconnect users in the session
  socket.on('quitSession', (roomId) => {
    console.log("A user clicked on quit session")
    // Check if the user is in the specified room
    if (socket.rooms.has(roomId)) {
      // Emit an event to inform the other user that the session is ending
      socket.to(roomId).emit('sessionEnded');
      // Leave the room
      socket.leave(roomId);
  
      // Remove the room from the 'rooms' map
      if (rooms.delete(roomId)) {
        console.log("Removed room with ID", roomId, "from rooms map.");
      } else {
        console.log("Room with ID", roomId, "not found in rooms map.");
      }
    }
  });
});

function startMatch(user1Socket, user2Socket, selectedDifficulty, selectedTopic) {
  const roomId = uuidv4();

  generateQuestion(selectedDifficulty, selectedTopic)
    .then((question) => {
      if (question) {
        rooms.set(roomId, { questionId: question._id, user1Id: user1Socket.id, user2Id: user2Socket.id });

        user1Socket.emit('match found', roomId, 'You are matched with another user!');
        user2Socket.emit('match found', roomId, 'You are matched with another user!');

        user1Socket.join(roomId);
        user2Socket.join(roomId);

        user1Socket.emit('question', question._id);
        user2Socket.emit('question', question._id);
      } else {
        console.error('Failed to fetch question.');
      }
    })
    .catch((error) => {
      console.error('Error generating question:', error);
    });
}

async function generateQuestion(difficulty, topic) {
  try {
    const response = await fetch(`http://localhost:3000/api/questions/matched?difficulty=${difficulty}&topics=${topic}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch question. Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
