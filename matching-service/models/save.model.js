module.exports = (sequelize, Sequelize) => {
    const Save = sequelize.define("savesession", {
      code: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
      }
    });
  
    return Save;
  };
  