const db = require('../models');
const config = require('../config/save.config');
const Save = db.save;
const Op = db.Sequelize.Op;

exports.save = (req, res) => {
  console.log("controller req.body:", req.body);

  try {
    const code = req.body.code;
    const arrOfUserIds = req.body.userIds;

    if (!code || !Array.isArray(arrOfUserIds) || arrOfUserIds.length === 0) {
      // Handle the case where 'code' is missing or 'userIds' is not an array or emptys
      console.log("Input arguments invalid in save controller");
      return res.status(400).send({ message: 'Invalid request data. code value is "' + code + '" and arrOfUserIds is ' + arrOfUserIds});
    }

    // Create an array to store the promises for creating rows
    const createPromises = [];

    for (const data of arrOfUserIds) {
      console.log("Saving: ", code, "|", data);
      // Save User to Database
      createPromises.push(
        Save.create({
          code: code,
          userId: data
        })
      );
    }

    // Execute all promises and respond once they are all completed
    Promise.all(createPromises)
      .then((saves) => {
        // All rows have been successfully created
        res.status(200).send({ message: 'Code data saved successfully' });
      })
      .catch((err) => {
        // Handle any errors that occurred during Promise execution
        res.status(500).send({ message: err.message });
      });
  } catch (error) {
    // Handle any unexpected errors that occur outside of the Promise chain
    res.status(500).send({ message: 'Error outside of promise chain, req.body value is ' + req.body });
  }
};
