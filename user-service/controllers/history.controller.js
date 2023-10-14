const db = require('../models');
const config = require('../config/auth.config');
const UserQuestions = db.userQuestions;
const User = db.user;
const Op = db.Sequelize.Op;
const sequelize = db.Sequelize;

exports.addHistory = (req, res) => {
  const { userId, questionId, difficulty } = req.body;

  UserQuestions.findOne({
    where: { userId: userId, question_id: questionId, difficulty: difficulty },
  }).then((userQuestions) => {
    // if (!userQuestions) {
    return UserQuestions.create({
      userId: userId,
      question_id: questionId,
      attemptedAt: new Date(),
      difficulty: difficulty,
    })
      .then((userQuestions) => {
        res.status(200).send({ message: 'User Questions added successfully!' });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  });
};

exports.getAllUniqueQuestions = (req, res) => {
  const { userId } = req.params;
  UserQuestions.findAll({
    where: { userId: userId },
    attributes: [
      'question_id',
      [sequelize.fn('MAX', sequelize.col('attemptedAt')), 'latestAttemptedAt'],
    ],
    group: ['question_id'],
    order: [[sequelize.literal('latestAttemptedAt'), 'ASC']],
  })
    .then((userQuestions) => {
      if (userQuestions) {
        return res.status(200).send(userQuestions);
      }
      return res.status(404).send({ message: 'User Questions not found!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllUniqueQuestionsByDifficulty = (req, res) => {
  const { userId, difficulty } = req.params;
  UserQuestions.findAll({
    where: { userId: userId, difficulty: difficulty },
    attributes: [
      'question_id',
      [sequelize.fn('MAX', sequelize.col('attemptedAt')), 'latestAttemptedAt'],
    ],
    group: ['question_id'],
    order: [[sequelize.literal('latestAttemptedAt'), 'ASC']],
  })
    .then((userQuestions) => {
      if (userQuestions) {
        return res.status(200).send(userQuestions);
      }
      return res.status(404).send({ message: 'User Questions not found!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllQuestions = (req, res) => {
  const { userId } = req.params;
  UserQuestions.findAll({
    where: { userId: userId },
    order: [['attemptedAt', 'ASC']],
    attributes: ['question_id', 'attemptedAt', 'difficulty'],
  })
    .then((userQuestions) => {
      if (userQuestions) {
        return res.status(200).send(userQuestions);
      }
      return res.status(404).send({ message: 'User Questions not found!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
