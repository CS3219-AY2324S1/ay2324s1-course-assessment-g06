const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // Import uuidv4 from the 'uuid' package
const rooms = new Map();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3002'], // Add the additional site's URL here
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
          // Handle non-successful HTTP responses (e.g., 404, 500, etc.)
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        return response.json(); // Parse JSON if the response is OK
      })
      .then((responseData) => {
        console.log(responseData);
        res.json(responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Send an error response to the client
        res.status(500).json({ error: 'Error fetching data from external API' });
      });
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
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
      startMatch(user1, socket, selectedDifficulty);
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

function startMatch(user1, user2, selectedDifficulty) {
  const roomId = uuidv4(); // Generate a unique room ID (you need to import uuid or use any other method)

  // Fetch the question based on the selected difficulty
  generateQuestion(selectedDifficulty)
    .then((question) => {
      if (question) {
        // Store the room information including the question ID
        rooms.set(roomId, { questionId: question._id });

        // Emit the room ID to both matched users
        user1.emit('match found', roomId, 'You are matched with another user!');
        user2.emit('match found', roomId, 'You are matched with another user!');

        // Have both users join the same room
        user1.join(roomId);
        user2.join(roomId);

        // Send the question ID to both users in this room
        user1.emit('question', question._id);
        user2.emit('question', question._id);
      } else {
        // Handle the case where the question could not be fetched
        console.error('Failed to fetch question.');
        // You may want to handle this situation appropriately.
      }
    })
    .catch((error) => {
      console.error('Error generating question:', error);
    });
}

async function generateQuestion(difficulty) {
  try {
    const response = await fetch(`http://localhost:3000/api/questions/matched?difficulty=${difficulty}`);
    console.log(`http://localhost:3000/api/questions/matched?difficulty=${difficulty}`)
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
