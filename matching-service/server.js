const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 from the 'uuid' package

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3001',
  },
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const waitingQueue = [];

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('match me', (selectedDifficulty) => {
    // Check if there's a user with the same selected difficulty in the queue
    const matchingUserIndex = waitingQueue.findIndex(
      (user) => user.selectedDifficulty === selectedDifficulty
    );

    if (matchingUserIndex !== -1) {
      console.log('User match!');
      const user1 = waitingQueue.splice(matchingUserIndex, 1)[0];
      startMatch(user1, socket);
    } else {
      console.log('No user found');
      socket.selectedDifficulty = selectedDifficulty;
      waitingQueue.push(socket);
    }
  });

  // Handle cancel match event
  socket.on('cancel match', () => {
    const index = waitingQueue.indexOf(socket);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
      console.log('Matching canceled by user');
      socket.emit('match canceled'); // Notify the client that the match is canceled
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    const index = waitingQueue.indexOf(socket);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
    }
  });
});

function startMatch(user1, user2) {
  const roomId = uuidv4(); // Generate a unique room ID (you need to import uuid or use any other method)

  // Emit the room ID to both matched users
  user1.emit('match found', roomId, 'You are matched with another user!');
  user2.emit('match found', roomId, 'You are matched with another user!');

  // Have both users join the same room
  user1.join(roomId);
  user2.join(roomId);
}
