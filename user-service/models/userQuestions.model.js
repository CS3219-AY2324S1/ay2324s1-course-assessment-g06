module.exports = (sequelize, Sequelize) => {
  const userQuestions = sequelize.define("userQuestions", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    question_id: {
      type: Sequelize.UUID, // Use UUID for MongoDB ObjectIds
      primaryKey: true,
      allowNull: false,
    },
    difficulty: {
      type: Sequelize.ENUM("Hard", "Medium", "Easy"),
    },
    attemptedAt: {
      type: Sequelize.DATE,
      primaryKey: true,
      allowNull: false
    },
    attempt: {
      type: Sequelize.TEXT,
      allowNull: false
    },
  });

  return userQuestions;
};
