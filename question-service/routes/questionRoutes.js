const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

// Route for retrieving questions
router.get("/", questionController.getAllQuestions);
router.get("/pagination/first", questionController.getFirstPaginatedQuestions);
router.get("/pagination/remaining", questionController.getRemainingPaginatedQuestions);

router.get("/matched", questionController.getRandomQuestionByFilter);
router.get("/:id", questionController.getQuestionById);

// Create a new question
router.post("/", questionController.createQuestion);

// Update an existing question by frontendQuestionId
router.put("/:id", questionController.updateQuestion);

// Delete a question by frontendQuestionId
router.delete("/:id", questionController.deleteQuestion);

// No difference if i add the below
// router.get("/", "add-question");

module.exports = router;
