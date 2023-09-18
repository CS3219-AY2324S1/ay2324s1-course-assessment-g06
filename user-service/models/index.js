//importing modules
const {Sequelize, DataTypes} = require('sequelize')


// MySQL credentials
const dbUsername = process.env.SQL_USERNAME;
const dbPassword = process.env.SQL_PASSWORD;
const dbName = 'user';

const sequelize = new Sequelize(dbName,dbUsername,dbPassword, {
  host: process.env.SQL_HOST,
  dialect: 'mysql'
});

//checking if connection is done
    sequelize.authenticate().then(() => {
        console.log(`Database connected to discover`)
    }).catch((err) => {
        console.log(err)
    })

    const db = {}
    db.Sequelize = Sequelize
    db.sequelize = sequelize

//connecting to model
db.users = require('./userModel') (sequelize, DataTypes)

//exporting the module
module.exports = db