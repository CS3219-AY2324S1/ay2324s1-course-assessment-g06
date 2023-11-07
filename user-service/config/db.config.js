const dotenv = require('dotenv').config({ path: '../.env' });

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
