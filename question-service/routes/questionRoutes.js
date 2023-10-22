const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const verifyUserToken = require('../middleware/verifyUserToken');  // Import the middleware
const verifyUserAdmin = require('../middleware/verifyUserAdmin');  // Import the middleware
const verifyUser2Token = require("../middleware/verifyUser2Token");

// Route for retrieving questions
router.get("/", verifyUserToken, questionController.getAllQuestions);
router.get("/pagination/first", verifyUserToken, questionController.getFirstPaginatedQuestions);
router.get("/pagination/remaining", verifyUserToken, questionController.getRemainingPaginatedQuestions);

router.get("/matched", [verifyUserToken, verifyUser2Token], questionController.getRandomQuestionByFilter);
router.get("/:id", verifyUserToken, questionController.getQuestionById);

// Create a new question
router.post("/", verifyUserAdmin, questionController.createQuestion);

// Update an existing question by frontendQuestionId
router.put("/:id", verifyUserAdmin, questionController.updateQuestion);

// Delete a question by frontendQuestionId
router.delete("/:id", verifyUserAdmin, questionController.deleteQuestion);

// No difference if i add the below
// router.get("/", "add-question");

module.exports = router;
