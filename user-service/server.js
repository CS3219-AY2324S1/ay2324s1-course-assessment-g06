// Use env file
const dotenv = require('dotenv').config({path: '../.env'});
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser'); // For parsing JSON request bodies
const cookieParser = require('cookie-parser')
const userRoutes = require ('./routes/userRoutes')
const db = require('./models')
const app = express();

// Enable CORS for all routes
app.use(cors());

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const PORT = process.env.PORT || 3001;


db.sequelize.sync({force: false}).then(() => {
  console.log('Database synchronised!');
})

app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  console.log(`Server has started! Open http://localhost:${{PORT}}`);
});

// The root route
app.get('/', async (req, res) => {
  res.send('Hello World!');
});
