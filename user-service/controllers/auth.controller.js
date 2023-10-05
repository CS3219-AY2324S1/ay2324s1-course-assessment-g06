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
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: 'User registered successfully!' });
          });
        });
      } else {
        // user role = 1
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
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

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
  //This userId is decoded from JWT token, decoded by middleware
  const id = req.userId;

  User.findOne({
    where: {
      id: id,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }
      user.destroy();
      res.status(200).send({ message: 'User deleted successfully!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateProfile = (req, res) => {
  const id = req.params.id;
  const { username, email } = req.body;
  // check if user exists
  User.findOne({
    where: {
      id: id,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }
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
  // const id = req.params.id;
  const id = req.userId;
  const { currentPassword, newPassword } = req.body;
  User.findOne({
    where: { id: id },
  }).then((user) => {
    // check user exists
    if (!user) {
      return res.status(404).send({ message: 'User Not found.' });
    }
    var passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid Password!',
      });
    }
    user.update({
      password: bcrypt.hashSync(newPassword, 8),
    });
    res.status(200).send({ message: 'Password updated successfully!' });
  });
};

exports.getProfile = (req, res) => {
  const id = req.params.id;
  User.findOne({
    where: {
      id: id,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

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
