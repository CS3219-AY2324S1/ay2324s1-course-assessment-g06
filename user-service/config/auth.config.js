const dotenv = require('dotenv').config({ path: '../.env' });

console.log("process.env.JWT_SECRET:", process.env.JWT_SECRET);

module.exports = {
  secret: process.env.JWT_SECRET
};
