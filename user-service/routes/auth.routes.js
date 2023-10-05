const { authJwt } = require("../middleware");
const { verifySignUp } = require('../middleware');
const controller = require('../controllers/auth.controller');
const verifyChange = require("../middleware/verifyChange");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // Used for signup, no JWT present
  app.post(
    '/api/auth/signup',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  // Used for signin, no JWT present
  app.post('/api/auth/signin', controller.signin);

  app.delete('/api/auth/removeuser', [authJwt.verifyToken], controller.removeUser);

  app.patch(
    '/api/auth/updateprofile',
    [authJwt.verifyToken, verifyChange.checkDuplicate],
    controller.updateProfile
  );

  app.patch('/api/auth/updatepassword', [authJwt.verifyToken], controller.updatePassword);
  
  app.get('/api/auth/getuser', [authJwt.verifyToken], controller.getProfile);

};
