module.exports = (sequelize, Sequelize) => {
  const SessionHistory = sequelize.define("session_history", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    questionId: {
      type: Sequelize.UUID, // Use UUID for MongoDB ObjectIds
      primaryKey: true,
      allowNull: false,
    },
    difficulty: {
      type: Sequelize.ENUM('Hard', 'Medium', 'Easy'),
    },
    attemptedDate: {
      type: Sequelize.DATE,
    },
    code: {
      type: Sequelize.TEXT,
    },
  });

  return SessionHistory;
};
