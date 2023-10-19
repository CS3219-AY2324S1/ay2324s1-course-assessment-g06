const db = require('../models');
const config = require('../config/auth.config');
const UserQuestions = db.userQuestions;
const User = db.user;
const Op = db.Sequelize.Op;
const sequelize = db.Sequelize;

// Controller function to create a user history
// Usage: Post request to http://localhost:3003/api/user/history
exports.addHistory = async (req, res) => {
  console.log("controller.save req.body:", req.body);
  console.log("controller.save req.userId:", req.userId);

  try {
    const userId = req.userId;
    const question_id = req.body.questionId;
    const difficulty = req.body.difficulty;
    const attempt = req.body.attempt;

    if (!question_id || !difficulty || !attempt) {
      // Handle the case where 'attempt' is missing
      console.log("Input arguments invalid in save controller");
      return res.status(400).send({ message: 'Invalid request data. Check if there are missing parameters or empty user ids.'});
    }

    // Create an array to store the promises for creating rows
    const upsertPromises = [];

    try {
      const [record, created] = await UserQuestions.findOrCreate({
        where: { userId: userId, question_id: question_id },
        defaults: {
          difficulty: difficulty,
          attemptedAt: db.sequelize.literal('CURRENT_TIMESTAMP'),
          attempt: attempt,
        },
      });
      
      // Insert or update record done by .update 
      await UserQuestions.update(
        {
          difficulty: difficulty,
          attemptedAt: db.sequelize.literal('CURRENT_TIMESTAMP'),
          attempt: attempt,
        },
        {
          where: { userId: userId, question_id: question_id },
        }
      );

      upsertPromises.push(Promise.resolve("Record executed successfully."));
    } catch (error) {
      console.log("Error in promise chain, " + error);
      upsertPromises.push(Promise.reject(error));
    }

    // Execute all promises and respond once they are all completed
    Promise.all(upsertPromises)
      .then((saves) => {
        // All rows have been successfully created
        res.status(200).send({ message: saves });
      })
      .catch((err) => {
        // Handle any errors that occurred during Promise execution
        res.status(500).send({ message: err.message });
      });
  } catch (error) {
    // Handle any unexpected errors that occur outside of the Promise chain
    console.log("Save Controller Error => " + error);
    res.status(500).send({ message: `Error outside of promise chain, req.body value is ${JSON.stringify(req.body)}` });
  }
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
