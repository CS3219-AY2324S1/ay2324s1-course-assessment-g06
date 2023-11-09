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

  // Endpoint to save user history
  // Returns:
  // 200 OK on success
  // 400 Bad Request for validation errors
  // 500 on Unexpected errors
  app.post("/api/hist/save", [authJwt.verifyToken], controller.addHistory);

  // Endpoint to save custom user history
  // Returns:
  // 200 OK on success
  // 401 Unauthorized if not authenticated or no token provided
  // 500 on Unexpected errors
  app.post(
    "/api/hist/customsave",
    [authJwt.verifyToken],
    controller.addCustomHistory
  );

  // Endpoint to get all unique questions from user history
  // Returns:
  // 200 OK on success
  // 401 Unauthorized if not authenticated or no token provided
  // 404 on User questions not found
  // 500 on Unexpected errors
  app.get(
    "/api/hist/get",
    [authJwt.verifyToken],
    controller.getAllUniqueQuestions
  );

  // Endpoint to get all unique questions from user history by difficulty
  // Returns:
  // 200 OK on success
  // 401 Unauthorized if not authenticated or no token provided
  // 404 on User questions not found
  // 500 on Unexpected errors
  app.get(
    "/api/hist/get/:difficulty",
    [authJwt.verifyToken],
    controller.getAllUniqueQuestionsByDifficulty
  );

  // Endpoint to get all attempted dates from user history
  // Returns:
  // 200 OK on success
  // 401 Unauthorized if not authenticated or no token provided
  // 404 on User questions not found
  // 500 on Unexpected errors
  app.get(
    "/api/hist/attempts",
    [authJwt.verifyToken],
    controller.getAttemptedDates
  );

  // Endpoint to get all questions from user history
  // Returns:
  // 200 OK on success
  // 401 Unauthorized if not authenticated or no token provided
  // 404 on User questions not found
  // 500 on Unexpected errors
  app.get(
    "/api/hist/getall",
    [authJwt.verifyToken],
    controller.getAllQuestions
  );
};
