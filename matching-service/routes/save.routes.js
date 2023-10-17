const controller = require('../controllers/save.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
          'Access-Control-Allow-Headers',
          'x-access-token, Origin, Content-Type, Accept'
        );
        next();
      });

    // To save code session
    app.post('/api/save/savesession', controller.save);
};
