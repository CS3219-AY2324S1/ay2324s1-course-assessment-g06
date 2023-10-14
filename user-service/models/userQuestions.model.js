module.exports = (sequelize, Sequelize) => {
  const userQuestions = sequelize.define('userQuestions', {
    question_id: {
      type: Sequelize.STRING,
    },
    attemptedAt: {
      type: Sequelize.DATE,
    },
    // make enum in future?
    difficulty: {
      type: Sequelize.STRING,
    },
  });

  return userQuestions;
};
