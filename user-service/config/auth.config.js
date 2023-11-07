const dotenv = require('dotenv').config({ path: '../.env' });


// This takes the JWT_SECRET from the .env file and exports it to be used in other files
module.exports = {
  secret: process.env.JWT_SECRET
};
