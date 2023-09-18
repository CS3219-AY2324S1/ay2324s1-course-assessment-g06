// Use env file
require('dotenv').config({path: '../.env'});
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser'); // For parsing JSON request bodies
const {Sequelize, DataTypes} = require('sequelize')
const cookieParser = require('cookie-parser')

const app = express();

// Enable CORS for all routes
app.use(cors());

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.listen(3001, () => {
  console.log('Server has started! Open http://localhost:3001');
});

// MySQL credentials
const dbUsername = process.env.SQL_USERNAME;
const dbPassword = process.env.SQL_PASSWORD;
const dbName = 'user';

const sequelize = new Sequelize(dbName,dbUsername,dbPassword, {
  host: process.env.SQL_HOST,
  dialect: 'mysql'
});

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// The root route
app.get('/', async (req, res) => {
  res.send('Hello World!');
});

module.exports = {sequelize, Sequelize, DataTypes};