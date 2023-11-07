const dotenv = require('dotenv').config({ path: '../.env' });

module.exports = {
  secret: process.env.JWT_SECRET
};
