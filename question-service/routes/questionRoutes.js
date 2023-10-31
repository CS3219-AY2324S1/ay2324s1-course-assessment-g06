const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const verifyUserToken = require("../middleware/verifyUserToken");
const verifyUserAdmin = require("../middleware/verifyUserAdmin");
const verifyUser2Token = require("../middleware/verifyUser2Token");

// Route for retrieving questions
router.get("/", verifyUserToken, questionController.getAllQuestions);
router.get(
  "/pagination/first",
  verifyUserToken,
  questionController.getFirstPaginatedQuestions
);
router.get(
  "/pagination/remaining",
  verifyUserToken,
  questionController.getRemainingPaginatedQuestions
);

router.get(
  "/matched",
  [verifyUserToken, verifyUser2Token],
  questionController.getRandomQuestionByFilter
);
router.get("/total", questionController.getQuestionTotal);

router.post("/questionbyid", questionController.getQuestionsByIds);

// Create a new question
router.post("/", verifyUserAdmin, questionController.createQuestion);

// Update an existing question by frontendQuestionId
router.put("/:id", verifyUserAdmin, questionController.updateQuestion);

router.get("/:id", verifyUserToken, questionController.getQuestionById);

// Soft delete a question by frontendQuestionId
router.patch("/:id", verifyUserAdmin, questionController.softDeleteQuestion);

module.exports = router;
