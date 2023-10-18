const db = require('../models');
const config = require('../config/save.config');
const SessionHistory = db.save;
const Op = db.Sequelize.Op;

exports.save = async (req, res) => {
  console.log("controller.save req.body:", req.body);
  console.log("controller.save req.userId:", req.userId);

  try {
    const userId = req.userId;
    const questionId = req.body.questionId;
    const difficulty = req.body.difficulty;
    const code = req.body.code;

    if (!questionId || !difficulty || !code) {
      // Handle the case where 'code' is missing or 'userIds' is not an array or emptys
      console.log("Input arguments invalid in save controller");
      return res.status(400).send({ message: 'Invalid request data. Check if there are missing parameters or empty user ids.'});
    }

    // Create an array to store the promises for creating rows
    const upsertPromises = [];

    try {
      const [record, created] = await SessionHistory.findOrCreate({
        where: { userId: userId, questionId: questionId },
        defaults: {
          difficulty: difficulty,
          attemptedDate: db.sequelize.literal('CURRENT_TIMESTAMP'),
          code: code,
        },
      });
      
      // Insert or update record done by .update 
      await SessionHistory.update(
        {
          difficulty: difficulty,
          attemptedDate: db.sequelize.literal('CURRENT_TIMESTAMP'),
          code: code,
        },
        {
          where: { userId: userId, questionId: questionId },
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
