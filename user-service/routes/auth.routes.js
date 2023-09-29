const { verifySignUp } = require('../middleware');
const controller = require('../controllers/auth.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.post(
    '/api/auth/signup',
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.post('/api/auth/signin', controller.signin);

  app.delete('/api/auth/removeuser/:id', controller.removeUser);

  app.patch(
    '/api/auth/updateprofile/:id',
    [verifySignUp.checkUpdateUsernameOrEmail],
    controller.updateProfile
  );

  app.patch('/api/auth/updatepassword/:id', controller.updatePassword);

  app.get('/api/auth/getuser/:id', controller.getProfile);
};
