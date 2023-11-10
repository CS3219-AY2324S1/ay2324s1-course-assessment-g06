const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");


// Route for retrieving questions
// Endpoint for retrieving all questions
// Returns:
// 200 OK on success
// 401 Unauthorized if not authenticated or no token provided
// 500 on Unexpected errors
router.get("/", questionController.getAllQuestions);

// Endpoint for retrieving first page paginated questions
// Returns:
// 200 OK on success
// 401 Unauthorized if not authenticated or no token provided
// 500 on Unexpected errors
router.get(
  "/pagination/first",
  questionController.getFirstPaginatedQuestions
);

// Endpoint for retrieving remaining paginated questions
// Returns:
// 200 OK on success
// 401 Unauthorized if not authenticated or no token provided
// 500 on Unexpected errors
router.get(
  "/pagination/remaining",
  questionController.getRemainingPaginatedQuestions
);

// Endpoint for retrieving a question for matched users
// Returns:
// 200 OK on success
// 401 Unauthorized if not authenticated or no token provided
// 403 Forbidden if second user is not authenticated
// 500 on Unexpected errors
router.get(
  "/matched",
  questionController.getRandomQuestionByFilter
);

// Endpoint for getting total number of questions for each difficulty
// Returns:
// 200 OK on success
router.get("/total", questionController.getQuestionTotal);

// Endpoint for retrieving all questions given a list of question ids
// Returns:
// 200 OK on success
// 401 Unauthorized if not authenticated or no token provided
// 403 Forbidden if user is not an admin
// 404 Not Found if question not found
// 500 on Unexpected errors
router.post("/questionbyid", questionController.getQuestionsByIds);

// Endpoint for creating a new question
// Returns:
// 200 OK on success
// 400 Bad Request if it's a repeated question
// 401 Unauthorized if not authenticated or no token provided
// 403 Forbidden if user is not an admin
// 500 on Unexpected errors
router.post("/", questionController.createQuestion);

// Endpoint for updating a question
// Returns:
// 200 OK on success
// 400 Bad Request if it's a repeated question
// 401 Unauthorized if not authenticated or no token provided
// 403 Forbidden if user is not an admin
// 404 Not Found if question not found
// 500 on Unexpected errors
router.put("/:id", questionController.updateQuestion);

// Endpoint for retrieving a question by id
// Returns:
// 200 OK on success
// 401 Unauthorized if not authenticated or no token provided
// 404 Not Found if question not found
// 500 on Unexpected errors
router.get("/:id", questionController.getQuestionById);

// Endpoint for soft deleting a question
// Returns:
// 200 OK on success
// 401 Unauthorized if not authenticated or no token provided
// 403 Forbidden if user is not an admin
// 404 Not Found if question not found
// 500 on Unexpected errors
router.patch("/:id", questionController.softDeleteQuestion);

module.exports = router;
