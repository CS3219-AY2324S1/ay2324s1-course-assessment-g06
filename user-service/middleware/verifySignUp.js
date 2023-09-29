const db = require('../models');
const ROLES = db.ROLES;
const User = db.user;
const { Op } = require("sequelize");


checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: 'Failed! Username is already in use!',
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: 'Failed! Email is already in use!',
        });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: 'Failed! Role does not exist = ' + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};

checkUpdateUsernameOrEmail = (req, res, next) => {
  const userId = req.params.id;
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

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
  checkUpdateUsernameOrEmail: checkUpdateUsernameOrEmail,
};

module.exports = verifySignUp;
