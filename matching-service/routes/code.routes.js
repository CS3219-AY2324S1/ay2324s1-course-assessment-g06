const { authJwt } = require("../middleware");
const controller = require('../controllers/code.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

   
    app.post('/api/code/run', [authJwt.verifyToken], controller.runcode);

};
