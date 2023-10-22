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
const QUESTION_HOST = process.env.QUESTION_HOST
  ? process.env.QUESTION_HOST
  : 'http://localhost:3000/api/questions';
// JK need change
const MATCHING_SERVICE_CORS =
  process.env.MATCHING_SERVICE_CORS || 'http://localhost:3002';

const FRONTEND_SERVICE_CORS =
  process.env.FRONTEND_SERVICE_CORS || 'http://localhost:3001';
const MATCHING_PORT = process.env.MATCHING_PORT || 3002;
const io = socketIo(server, {
  cors: {
    origin: [FRONTEND_SERVICE_CORS, MATCHING_SERVICE_CORS],
  },
});

// database
const db = require('./models');
const SessionHistory = db.SessionHistory;
db.sequelize.sync();

// Verification
const axios = require('axios');
const USER_SERVICE = process.env.USER_SERVICE || "http://localhost:3003";

async function isTokenValid(accessToken) {
  try {
    const response = await axios.get(`${USER_SERVICE}/api/auth/verifyToken`, {
      headers: { "x-access-token":accessToken}
    });
    return response.status === 200;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define after app.use
require('./routes/save.routes')(app);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

console.log("Server is starting...")
// server.listen(3002, () => {
//   console.log('Server is listening on port 3002');
// });

server.listen(MATCHING_PORT, () => {
  console.log(`Server is listening on port ${MATCHING_PORT}`);
});

app.get('/api/room/:roomId', async (req, res) => {
  console.log('Received GET request for /api/room/:roomId');
  const roomId = req.params.roomId;
  const roomInfo = rooms.get(roomId);
  console.log("rooms data: ", rooms);

  // Access the access token from the room's data
  // @Sean, these are the 2 access token to use for verification
  const accessToken1 = roomInfo.accessToken1;
  const accessToken2 = roomInfo.accessToken2;

  // Do the checks here
  const user1Valid = await isTokenValid(accessToken1);
  const user2Valid = await isTokenValid(accessToken2);

  // Display status of both users
  console.log("User 1 get room validity: ", user1Valid);
  console.log("User 2 get room validity: ", user2Valid);

  if (!user1Valid || !user2Valid) {
    console.log("User not authorized to join room.");
    return res.status(401).send("One of the user's token is invalid.");
  }

  // Check if the room is still active
  if (rooms.has(roomId)) {
    // Check if user belongs in this room
    const questionId = roomInfo.questionId;
    fetch(QUESTION_HOST + `/${questionId}`, {
      headers: {
        "x-access-token": accessToken1,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        // console.log("success", response.json());
        return response.json();
      })
      .then((responseData) => {
        res.json(responseData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        res
          .status(500)
          .json({ error: 'Error fetching data from external API' });
      });
  } else {
    // Room not found, throw 404 error to api request
    res.status(404).send('Room not found');
  }
});

const waitingQueue = [];

// Middleware to authenticate users using JWT token
// Can check token validity here
io.use(socketioJwt.authorize({
  secret: 'secret',
  handshake: true,
}));

io.on('connection', async (socket) => {
  console.log('A user connected');
  console.log('User Token:', socket.decoded_token, "connected");
  
  socket.on('match me', (selectedDifficulty, selectedTopic, selectedLanguage, accessToken) => {
    const userId = socket.decoded_token.id;

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
        startMatch(user1, socket, selectedDifficulty, selectedTopic, accessToken);
      } else {
        console.log('No user found');
        socket.userId = userId;
        socket.selectedDifficulty = selectedDifficulty;
        socket.selectedTopic = selectedTopic;
        socket.selectedLanguage = selectedLanguage;
        socket.accessToken = accessToken;
        waitingQueue.push(socket);
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
    // Check if the user is in the specified room
    if (rooms.has(roomId)) {
      const roomInfo = rooms.get(roomId);
      const user = socket.decoded_token; 
  
      if (user === roomInfo.user1 || user === roomInfo.user2) {
        socket.join(roomId);
        socket.to(roomId).emit('userConnected');
      } else {
        socket.emit('accessDenied', 'You are not authorized to join this room.');
      }
    } else {
      socket.emit('accessDenied', 'Room not found or no user information available.');
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
        
        removeRoomSession(roomId);
        break; // Guard clause
      }
    }
    socket.leave();
  });

  socket.on('timerEnd', (roomId) => {
    console.log("The time has ended");
    // Check if the user is in the specified room
    removeRoomSession(roomId);
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
      removeRoomSession(roomId);
    }
  });

  // Submit data to sql history
  socket.on('submitSession', (roomId, questionId, questionDifficulty) => {
    console.log("A user clicked on submit session")
    
    // Check if the user is in the specified room
    if (socket.rooms.has(roomId)) {
      // Emit an event to inform the other user that the session is being submitted
      console.log("sharing id and difficulty: ", questionId, questionDifficulty);
      socket.to(roomId).emit('submitSession', questionId, questionDifficulty);
      // Leave the room
      socket.leave(roomId);
    }
  });

  // Submit data to sql history
  socket.on('submitIndividualSession', (roomId, questionId, questionDifficulty) => {
    console.log("A user clicked on submit session on timer end")
    socket.leave(roomId);
  });
});

function removeRoomSession(roomId) {
  if (rooms.delete(roomId)) {
    console.log("Removed room with ID", roomId, "from rooms map.");
  } else {
    console.log("Room with ID", roomId, "not found in rooms map.");
  }
}

async function startMatch(user1Socket, user2Socket, selectedDifficulty, selectedTopic, accessToken) {
  const roomId = uuidv4();
  // console.log("This is the accesstoken1: " + user1Socket.accessToken);
  // console.log("This is the accesstoken2: " + accessToken);

  const accessToken1 = user1Socket.accessToken;
  const accessToken2 = accessToken;

  const user1Valid = await isTokenValid(accessToken1);
  const user2Valid = await isTokenValid(accessToken2);

  // Display status of both users
  console.log("User 1 start match validity: ", user1Valid);
  console.log("User 2 start match validity: ", user2Valid);

  if (!user1Valid) {
    user1Socket.emit('error', 'Authentication failed.');
    console.log("User 1 is not valid")
    return;  // end the function
  }

  if (!user2Valid) {
    user2Socket.emit('error', 'Authentication failed.');
    console.log("User 2 is not valid")
    return;  // end the function
  }

  generateQuestion(selectedDifficulty, selectedTopic, accessToken1, accessToken2)
    .then((question) => {
      if (question) {
        rooms.set(roomId, { questionId: question._id, user1Id: user1Socket.id, user2Id: user2Socket.id, accessToken1: user1Socket.accessToken, accessToken2: accessToken });

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

async function generateQuestion(difficulty, topic, accessToken1, accessToken2) {
  // console.log("This is the accesstoken: " + accessToken);
  try {
    const response = await fetch(
      QUESTION_HOST + `/matched?difficulty=${difficulty}&topics=${topic}`, {
        headers: {
          "x-access-token": accessToken1,
          "x-access-token2": accessToken2,
        },
      }
    );
    console.log(QUESTION_HOST);
    if (!response.ok) {
      throw new Error(`Failed to fetch question. Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
