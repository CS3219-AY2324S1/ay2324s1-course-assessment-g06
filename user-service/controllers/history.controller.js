const db = require('../models');
const config = require('../config/auth.config');
const UserQuestions = db.userQuestions;
const User = db.user;
const Op = db.Sequelize.Op;
const sequelize = db.Sequelize;

// Controller function to create a user history
// Usage: Post request to http://localhost:3003/api/user/history
exports.addHistory = (req, res) => {
  const { userId, questionId, difficulty, attempt } = req.body;

  UserQuestions.create({
    userId: userId,
    question_id: questionId,
    attemptedAt: new Date(),
    difficulty: difficulty,
    attempt: attempt,
  })
    .then((userQuestions) => {
      res.status(200).send({ message: 'User Questions added successfully!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// Controller function to create a user history with custom date
// Usage: Post request to http://localhost:3003/api/user/customhistory
exports.addCustomHistory = (req, res) => {
  const { userId, questionId, difficulty, attempt, date } = req.body;

  UserQuestions.create({
    userId: userId,
    question_id: questionId,
    attemptedAt: new Date(date),
    difficulty: difficulty,
    attempt: attempt,
  })
    .then((userQuestions) => {
      res.status(200).send({ message: 'User Questions added successfully!' });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// Controller function to get all unique questions id
// Usage: Get request to http://localhost:3003/api/user/history/:id
exports.getAllUniqueQuestions = (req, res) => {
  const { userId } = req.params;
  UserQuestions.findAll({
    where: { userId: userId },
    attributes: [
      'question_id',
      'difficulty',
      [sequelize.fn('MAX', sequelize.col('attemptedAt')), 'latestAttemptedAt'],
    ],
    group: ['question_id', 'difficulty'],
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

// Controller function to get all questions id
// Usage: Get request to http://localhost:3003/api/user/history/:id/Medium
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

// Controller function to get all questions id for one user
// Usage: Get request to http://localhost:3003/api/user/allhistory/:id
exports.getAllQuestions = (req, res) => {
  const { userId } = req.params;
  UserQuestions.findAll({
    where: { userId: userId },
    order: [['attemptedAt', 'ASC']],
    attributes: ['question_id', 'attemptedAt', 'difficulty', 'attempt'],
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

// controller function to update difficulty of question
// Usage: Put request to http://localhost:3003/api/user/Question/:id

// Controller function to get all questions id for one user
// Usage: Get request to http://localhost:3003/api/user/allhistory/:id
exports.getAttemptedDates = (req, res) => {
  const { userId } = req.params;
  UserQuestions.findAll({
    where: { userId: userId },
    order: [['attemptedAt', 'ASC']],
    attributes: [
      ['attemptedAt', 'date'],
      [sequelize.fn('COUNT', sequelize.col('attemptedAt')), 'count'],
    ],
    group: ['attemptedAt'],
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
