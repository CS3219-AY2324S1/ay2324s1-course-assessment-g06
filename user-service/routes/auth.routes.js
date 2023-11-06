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

  // Endpoint for user signup
  // Returns:
  // 200 OK on success
  // 400 Bad Request for validation errors
  app.post(
    '/api/auth/signup',
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    controller.signup
  );

  // Endpoint for user signin
  // Returns:
  // 200 OK on success
  // 401 Unauthorized for invalid credentials
  app.post('/api/auth/signin', controller.signin);

  // Endpoint to remove a user
  // Returns:
  // 200 OK on success
  // 401 Unauthorized if not authenticated or no token provided
  app.delete('/api/auth/removeuser', [authJwt.verifyToken], controller.removeUser);

  // Endpoint to update user password, email or username
  // Returns:
  // 200 OK on success
  // 400 Bad Request on validation errors
  // 401 Unauthorized if not authenticated or no token provided
  app.patch('/api/auth/updateprofile',
    [authJwt.verifyToken, verifyExisting.checkEmail, verifyExisting.checkUsername],
    controller.updateProfile
  );

  // Endpoint to update user password
  // 200 OK on success
  // 401 Unauthorized if not authenticated or no token provided
  app.patch('/api/auth/updatepassword', [authJwt.verifyToken], controller.updatePassword);
  
  // Endpoint to get user profile
  // 200 OK on success
  // 401 Unauthorized if not authenticated or no token provided
  app.get('/api/auth/getuser', [authJwt.verifyToken], controller.getProfile);

  // Endpoint to verify JWT token
  // 200 OK on success
  // 401 Unauthorized if not authenticated or no token provided
  app.get('/api/auth/verifytoken', [authJwt.verifyToken], controller.verifyToken);

  // Endpoint to verify if user is an admin
  // 200 OK on success
  // 401 Unauthorized if not authenticated or no token provided
  // 403 Forbidden if not admin
  app.get('/api/auth/verifyadmin', [authJwt.verifyToken, authJwt.isAdmin], controller.verifyAdmin);
};
