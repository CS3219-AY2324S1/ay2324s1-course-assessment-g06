const controller = require('../controllers/save.controller');
const { saveJwt } = require("../middleware");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        );
        next();
    });

    console.log("calling app post /api/save/savesession");
    // Apply the verifyToken middleware before the controller.save
    app.post('/api/save/savesession', [saveJwt.verifyToken], controller.save);

    // NOTE: To refactor code after merging of branch-Analytics with updated services of saving of history at user-service instead of matching-service
    // Will be changed to api/collab/runcode
    app.post('/api/save/runcode', [saveJwt.verifyToken], controller.runcode);

};
