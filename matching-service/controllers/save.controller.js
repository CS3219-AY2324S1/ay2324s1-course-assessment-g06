const db = require('../models');
const config = require('../config/save.config');
const SessionHistory = db.save;
const Op = db.Sequelize.Op;

// For calling OneCompiler for code run
const axios = require('axios');

// Controller function to save a user collaboration session attempt to history
// Usage: Post request to http://localhost:3002/api/save/savesession
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

// NOTE: To refactor code after merging of branch-Analytics with updated services of saving of history at user-service instead of matching-service

// Controller function to post a code execution/run attempt to OneCompiler
// Usage: Post request to /api/save/runcode or directly to https://onecompiler-apis.p.rapidapi.com/api/v1/run
exports.runcode = async (req, res) => {
  console.log("controller.runcode req.body:", req.body);
  
  try {
    const code = req.body.code;
    const input = req.body.input;
    const language = req.body.language;
    const fileName = req.body.fileName;
    const XApiKey = process.env.XApiKey
    const XApiHost = process.env.XApiHost

    // Code retrieved from OneCompiler connected via RapidAPI
    const options = {
      method: 'POST',
      url: 'https://onecompiler-apis.p.rapidapi.com/api/v1/run',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': XApiKey,
        'X-RapidAPI-Host': XApiHost,
      },
      data: {
        language: language,
        stdin: input,
        files: [
          {
            name: fileName,
            content: code
          }
        ]
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log("result of execution:", response.data);
    } catch (error) {
      console.error("error in controller:", error);
    }
  } catch (error) {
    // Handle any unexpected errors that occur outside of the Promise chain
    console.log("Run Code Controller Error => " + error);
    res.status(500).send({ message: `req.body value is ${JSON.stringify(req.body)}` });
  }
};
