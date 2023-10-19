const { authJwt } = require("../middleware");
const controller = require('../controllers/history.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post('/api/user/history', [authJwt.verifyToken], controller.addHistory);
  app.post('/api/user/customhistory', controller.addCustomHistory);
  app.get('/api/user/history/:userId', controller.getAllUniqueQuestions);
  app.get(
    '/api/user/history/:userId/:difficulty',
    controller.getAllUniqueQuestionsByDifficulty
  );
  app.get('/api/user/attempts/:userId', controller.getAttemptedDates);
  app.get('/api/user/allhistory/:userId', controller.getAllQuestions);
};
