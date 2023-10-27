const dotenv = require('dotenv').config({ path: '../.env' });

// Logging for debugging use
console.log("USER-SERVICE ENVIRONMENT VARIABLES");
console.log("process.env.SQL_HOST:", process.env.SQL_HOST);
console.log("process.env.SQL_USERNAME:", process.env.SQL_USERNAME);
console.log("process.env.SQL_PASSWORD:", process.env.SQL_PASSWORD);

module.exports = {
  HOST: process.env.SQL_HOST,
  USER: process.env.SQL_USERNAME,
  PASSWORD: process.env.SQL_PASSWORD,
  DB: "user",
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
