const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;
const { Op } = require("sequelize");

checkExistingUsernameEmail = (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  const { username, email } = req.body;
  // Username
  User.count({
    where: {
      username: username,
      id: {
        [Op.not]: userId,
      },
    },
  }).then((count) => {
    if (count > 0) {
      res.status(400).send({
        message: 'Failed! Username is already in use!',
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: email,
        id: {
          [Op.not]: userId,
        },
      },
    }).then((count) => {
      if (count) {
        res.status(400).send({
          message: 'Failed! Email is already in use!',
        });
        return;
      }
      next();
    });
  });
};

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
    checkDuplicate: checkExistingUsernameEmail,
    checkEmail: checkExistingEmail,
    checkUsername: checkExistingUsername,
  };
  
  module.exports = verifyExisting;