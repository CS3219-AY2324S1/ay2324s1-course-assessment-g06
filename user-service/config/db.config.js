const dotenv = require('dotenv').config({ path: '../.env' });

// This takes the SQL_HOST, SQL_USERNAME, and SQL_PASSWORD from the .env file and exports it to be used in other files
// It also configures the dialect to be used by Sequelize
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
