const express = require('express');
const router = express.Router();
const questionController = require("../controllers/questionController");
const verifyUserToken = require('../middleware/verifyUserToken');
const verifyUserAdmin = require('../middleware/verifyUserAdmin');
const verifyUser2Token = require("../middleware/verifyUser2Token");

// Route for retrieving questions
router.get("/", verifyUserToken, questionController.getAllQuestions);

router.get("/pagination/first", verifyUserToken, questionController.getFirstPaginatedQuestions);

router.get("/pagination/remaining", verifyUserToken, questionController.getRemainingPaginatedQuestions);

router.get("/matched", [verifyUserToken, verifyUser2Token], questionController.getRandomQuestionByFilter);

router.get("/:id", verifyUserToken, questionController.getQuestionById);

router.get('/matched', questionController.getRandomQuestionByFilter);

router.get('/total', questionController.getQuestionTotal);

// must be last method if not it'll always call this method
router.get('/:id', questionController.getQuestionById);

router.post('/questionbyid', questionController.getQuestionsByIds);

// Create a new question
router.post("/", verifyUserAdmin, questionController.createQuestion);

// Update an existing question by frontendQuestionId
router.put("/:id", verifyUserAdmin, questionController.updateQuestion);

// Soft delete a question by frontendQuestionId
router.delete("/:id", verifyUserAdmin, questionController.softDeleteQuestion);

module.exports = router;
