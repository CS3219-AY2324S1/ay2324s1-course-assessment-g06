const Question = require("../models/question");

module.exports = {
  // Controller function to get all questions
  // Usage: Get request to http://localhost:3000/api/questions/
  getAllQuestions: (req, res) => {
    Question.find()
      .then((questions) => {
        res.json(questions);
      })
      .catch((error) => {
        res.status(500).json({ error: "Error fetching questions" });
      });
  },
  // Controller function to get a question by its _id
  // Usage: Get request to http://localhost:3000/api/questions/:id
  getQuestionById: (req, res) => {
    const { id } = req.params; // Get the _id from the request params
    console.log(id);
    Question.findById(id)
      .then((question) => {
        if (!question) {
          return res.status(404).json({ error: "Question not found" });
        }
        res.json(question);
      })
      .catch((error) => {
        res.status(500).json({ error: "Error fetching question" });
      });
  },
  // Controller function to create a new question
  // Usage: Post request to http://localhost:3000/api/questions
  createQuestion: (req, res) => {
    console.log(
      "Mongo posting question to http://localhost:3000/api/questions"
    );
    const { title, frontendQuestionId, difficulty, content, category, topics } =
      req.body;
  
    // Check if a question with the same title already exists
    Question.findOne({ title })
      .then((existingQuestion) => {
        if (existingQuestion) {
          return res.status(400).json({ error: "Question with this title already exists" });
        }
  
        const newQuestion = new Question({
          title,
          frontendQuestionId,
          difficulty,
          content,
          category,
          topics,
        });
  
        newQuestion
          .save()
          .then((question) => {
            res.json(question);
          })
          .catch((error) => {
            res.status(500).json({ error: "Error creating question" });
          });
      })
      .catch((error) => {
        res.status(500).json({ error: "Error checking for existing question" });
      });
  },  
  // Controller function to update an existing question by ID
  // Usage: Put request to http://localhost:3000/api/questions/{id}
  updateQuestion: (req, res) => {
    const { id } = req.params; // Get the question ID from the route parameters
    // Put only the fields that you want to change in the body
    // Use x-www-form-urlencoded
    const { title, frontendQuestionId, difficulty, content, category, topics } =
      req.body;

    Question.findByIdAndUpdate(
      id,
      {
        title,
        frontendQuestionId,
        difficulty,
        content,
        category,
        topics,
      },
      { new: true } // Return the updated document
    )
      .then((question) => {
        if (!question) {
          return res.status(404).json({ error: "Question not found" });
        }
        res.json(question);
      })
      .catch((error) => {
        res.status(500).json({ error: "Error updating question" });
      });
  },
  // Controller function to delete a question by ID
  // Usage: Delete request to http://localhost:3000/api/questions/{id}
  deleteQuestion: (req, res) => {
    const { id } = req.params; // Get the question ID from the route parameters

    Question.findByIdAndRemove(id)
      .then((question) => {
        if (!question) {
          return res.status(404).json({ error: "Question not found" });
        }
        res.json({ message: "Question deleted successfully" });
      })
      .catch((error) => {
        res.status(500).json({ error: "Error deleting question" });
      });
  },
  // Controller function to get a random question via given filters
  // Usage: GET request to http://localhost:3000/api/questions/matched?difficulty=<difficulty_level>
  getRandomQuestionByFilter: (req, res) => {
    const { difficulty } = req.query; // Get the difficulty level from the query parameter

    // Define a filter object based on the provided difficulty level
    const filter = {};

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Use the aggregate function to select a random question based on the filter
    Question.aggregate([
      { $match: filter }, // Match questions that meet the filter criteria
      { $sample: { size: 1 } }, // Select a random question (adjust 'size' for more questions)
    ])
      .then((questions) => {
        if (questions.length === 0) {
          return res.status(404).json({ error: "No questions found for the given filter" });
        }
        res.json(questions[0]); // Return the random question
      })
      .catch((error) => {
        res.status(500).json({ error: "Error fetching random question" });
      });
  },
};

