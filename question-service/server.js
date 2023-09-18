// Use env file
require('dotenv').config({path: '../.env'});
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // For parsing JSON request bodies
const questionRoutes = require('./routes/questionRoutes');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.listen(3000, () => {
  console.log('Server has started! Open http://localhost:3000');
});

// MongoDB Atlas credentials
const dbUsername = encodeURIComponent(process.env.MONGO_USERNAME);
const dbPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const clusterUrl = process.env.MONGO_CLUSTER_URL;
const dbName = 'questions';

// Connection URI for MongoDB Atlas
const uri = `mongodb+srv://${dbUsername}:${dbPassword}@${clusterUrl}/${dbName}?retryWrites=true&w=majority`;

// Establish the MongoDB connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check for MongoDB Atlas connection
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Use the question routes
app.use('/api/questions', questionRoutes);

// The root route
app.get('/', (req, res) => {
    res.json({"message": "Hello Crud Node Express"});
});
