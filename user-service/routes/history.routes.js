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
  app.post('/api/user/customhistory', [authJwt.verifyToken], controller.addCustomHistory);
  app.get('/api/user/history', [authJwt.verifyToken], controller.getAllUniqueQuestions);
  app.get(
    '/api/user/history/:difficulty',
    [authJwt.verifyToken],
    controller.getAllUniqueQuestionsByDifficulty
  );
  app.get('/api/user/attempts', [authJwt.verifyToken], controller.getAttemptedDates);
  app.get('/api/user/allhistory', [authJwt.verifyToken], controller.getAllQuestions);
};