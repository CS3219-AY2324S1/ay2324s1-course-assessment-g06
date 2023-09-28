const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const rooms = new Map();

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
  if (roomInfo) {
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
    res.status(404).json({ error: 'Room not found' });
  }
});

const waitingQueue = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('match me', (selectedDifficulty, selectedTopic) => {
    console.log(selectedDifficulty)
    const matchingUserIndex = waitingQueue.findIndex(
      (user) => user.selectedDifficulty === selectedDifficulty && user.selectedTopic === selectedTopic
    );

    if (matchingUserIndex !== -1) {
      console.log('User match!');
      const user1 = waitingQueue.splice(matchingUserIndex, 1)[0];
      startMatch(user1, socket, selectedDifficulty, selectedTopic);
    } else {
      console.log('No user found');
      socket.selectedDifficulty = selectedDifficulty;
      socket.selectedTopic = selectedTopic;
      waitingQueue.push(socket);
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
    // Use Socket.IO's join method to add the socket to the room
    socket.join(roomId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    const index = waitingQueue.indexOf(socket);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
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

  // Listen for the 'codeChange' event from the client
  socket.on('languageChange', (newLanguage, roomId) => {
    console.log('emit languagechange from server');

    // Check if the sender belongs to the same room
    if (socket.rooms.has(roomId)) {
      // Broadcast the code change only to sockets in the same room
      io.to(roomId).emit('languageChange', newLanguage);
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



});

function startMatch(user1, user2, selectedDifficulty, selectedTopic) {
  const roomId = uuidv4();

  generateQuestion(selectedDifficulty, selectedTopic)
    .then((question) => {
      if (question) {
        rooms.set(roomId, { questionId: question._id });

        user1.emit('match found', roomId, 'You are matched with another user!');
        user2.emit('match found', roomId, 'You are matched with another user!');

        user1.join(roomId);
        user2.join(roomId);

        user1.emit('question', question._id);
        user2.emit('question', question._id);
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
