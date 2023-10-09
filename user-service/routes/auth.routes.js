const { authJwt } = require("../middleware");
const { verifySignUp } = require('../middleware');
const controller = require('../controllers/auth.controller');
const verifyExisting = require("../middleware/verifyExisting");

module.exports = function (app) {

  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  // Format is, app.action('ROUTE', [Middleware, access, to, req], controller.action)
  // [authJwt.verifyToken] is the middleware to verify JWT token
  // e.g. After authJwt.verifyToken, the req object will have userId decoded from JWT token
  // The req object will be passed to controller.action

  // Used for signup, no JWT present
  app.post(
    '/api/auth/signup',
    [
      verifyExisting.checkEmail,
      verifyExisting.checkUsername,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  // Used for signin, no JWT present
  app.post('/api/auth/signin', controller.signin);

  app.delete('/api/auth/removeuser', [authJwt.verifyToken], controller.removeUser);

  app.patch(
    '/api/auth/updateprofile',
    [authJwt.verifyToken, verifyExisting.checkEmail, verifyExisting.checkUsername],
    controller.updateProfile
  );

  app.patch('/api/auth/updatepassword', [authJwt.verifyToken], controller.updatePassword);
  
  app.get('/api/auth/getuser', [authJwt.verifyToken], controller.getProfile);

};
