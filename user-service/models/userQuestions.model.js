// module.exports = (sequelize, Sequelize) => {
//   const userQuestions = sequelize.define('userQuestions', {
//     question_id: {
//       type: Sequelize.STRING,
//     },
//     attemptedAt: {
//       type: Sequelize.DATE,
//     },
//     // make enum in future?
//     difficulty: {
//       type: Sequelize.STRING,
//     },
//     attempt: {
//       type: Sequelize.STRING,
//     }
//   });

//   return userQuestions;
// };

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
      type: Sequelize.ENUM('Hard', 'Medium', 'Easy'),
    },
    attemptedAt: {
      type: Sequelize.DATE,
    },
    attempt: {
      type: Sequelize.TEXT,
    },
  });

  return userQuestions;
};
