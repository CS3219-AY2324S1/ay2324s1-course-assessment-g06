const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;
const { Op } = require("sequelize");

checkExistingUsername = (req, res, next) => {
  const userId = req.userId;
  const { username } = req.body;
  // Username
  User.count({
    where: {
      username: username,
      id: {
        [Op.not]: userId,
      },
    },
  }).then((count) => {
    // If this username is already in use, send 400 error
    if (count > 0) {
      res.status(400).send({
        message: 'Failed! Username is already in use!',
      });
      return;
    }
    next();
  });
};

checkExistingEmail = (req, res, next) => {
  const userId = req.userId;
  const { email } = req.body;
  // Username
  User.findOne({
    where: {
      email: email,
      id: {
        [Op.not]: userId,
      },
    },
  }).then((count) => {
    // If this email is already in use, send 400 error
    if (count) {
      res.status(400).send({
        message: 'Failed! Email is already in use!',
      });
      return;
    }
    next();
  });
};


  const verifyExisting = {
    checkEmail: checkExistingEmail,
    checkUsername: checkExistingUsername,
  };
  
  module.exports = verifyExisting;