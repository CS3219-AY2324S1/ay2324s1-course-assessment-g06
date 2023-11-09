const { authJwt } = require("../middleware");
const controller = require("../controllers/history.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/hist/save", [authJwt.verifyToken], controller.addHistory);

  app.post("/api/hist/customsave", [authJwt.verifyToken], controller.addCustomHistory);

  app.get("/api/hist/attempts", [authJwt.verifyToken], controller.getAttemptedDates );

  app.get("/api/hist/get", [authJwt.verifyToken], controller.getAllQuestions);
};
