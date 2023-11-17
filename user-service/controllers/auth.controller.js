const db = require('../models');
const config = require('../config/auth.config');
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      // If there are roles to be set, find them and set them.
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          // If there are roles to be set, find them and set them.
          user.setRoles(roles).then(() => {
            res.send({ message: 'User registered successfully!' });
          });
        });
      } else {
        // Else, set as normal user
        // 1 = Role_User
        // 2 = Role_Admin
        user.setRoles([1]).then(() => {
          res.send({ message: 'User registered successfully!' });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  // Find the user with username
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      // If user not found, return 401
      if (!user) {
        return res.status(401).send({ message: 'Invalid username or password' });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      // If password is invalid, return 401
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid username or password',
        });
      }

      // If user is found and password is valid, create token
      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      // Get roles and send response with token
      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push('ROLE_' + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.removeUser = (req, res) => {

  // Extract the id from request
  const id = req.userId;

  // Find the user with id
  User.findOne({
    where: {
      id: id,
    },
  })
    .then((user) => {
      // If user not found, return 404
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }
      // Else, delete the user
      user.destroy();
      res.status(200).send({ message: 'User deleted successfully!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateProfile = (req, res) => {
  // Extract the id from request
  const id = req.userId;
  // Extract the username and email from request
  const { username, email } = req.body;

  // Find the user with id
  User.findOne({
    where: {
      id: id,
    },
  })
    .then((user) => {
      // If user not found, return 404
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }
      // Else, update the user
      user.update({
        username,
        email,
      });
      res.status(200).send({ message: 'User updated successfully!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updatePassword = (req, res) => {

  // Extract the id from request
  const id = req.userId;
  // Extract the current password and new password from request
  const { currentPassword, newPassword } = req.body;

  // Find the user with id
  User.findOne({
    where: { id: id },
  }).then((user) => {
    // If user not found, return 404
    if (!user) {
      return res.status(404).send({ message: 'User Not found.' });
    }
    var passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
    // If password is invalid, return 401
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
      });
    }
    // Else, update the user
    user.update({
      password: bcrypt.hashSync(newPassword, 8),
    });
    res.status(200).send({ message: 'Password updated successfully!' });
  });
};

exports.getProfile = (req, res) => {

  // Extract the id from request
  const id = req.userId;
  
  // Find the user with id
  User.findOne({
    where: {
      id: id,
    },
  })
    .then((user) => {
      // If user not found, return 404
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      // Else, send the user
      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push('ROLE_' + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.verifyToken = (req, res) => {
  // If the middleware successfully verified the token, the user is authenticated.
  // Return successful response to the client here.
  res.status(200).send({ message: "Token is valid." });
};

exports.verifyAdmin = (req, res) => {
  // If the middleware successfully verified the token, and is admin.
  // Return successful response to the client here.
  res.status(200).send({ message: "User is admin." });
};
