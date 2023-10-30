const Question = require('../models/question');
const mongoose = require('mongoose');

module.exports = {
  // Controller function to get all questions where isDeleted is false
  // Usage: Get request to http://localhost:3000/api/questions/
  getAllQuestions: (req, res) => {
    Question.find({ isDeleted: false })
      .then((questions) => {
        res.json(questions);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error fetching questions' });
      });
  },
  // Controller function to get first page paginated questions where isDeleted is false
  // Usage: Get request to http://localhost:3000/api/questions/pagination/first
  getFirstPaginatedQuestions: (req, res) => {
    const perPage = 20;

    Question.find({ isDeleted: false })
      .limit(perPage)
      .then((questions) => {
        res.json(questions);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error fetching questions' });
      });
  },
  // Controller function to get remaining paginated questions where isDeleted is false
  // Usage: Get request to http://localhost:3000/api/questions/pagination/remaining
  getRemainingPaginatedQuestions: (req, res) => {
    const perPage = 20;
    Question.find({ isDeleted: false })
      .skip(perPage)
      .then((questions) => {
        res.json(questions);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error fetching questions' });
      });
  },
  // Controller function to get a question by its _id where isDeleted is false
  // Usage: Get request to http://localhost:3000/api/questions/:id
  getQuestionById: (req, res) => {
    const { id } = req.params; // Get the _id from the request params
    console.log('Getting Qn with ID:', id);
    Question.findOne({ _id: id, isDeleted: false })
      .then((question) => {
        if (!question) {
          return res.status(404).json({ error: 'Question not found' });
        }
        res.json(question);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error fetching question' });
      });
  },
  // Controller function to create a new question
  // Usage: Post request to http://localhost:3000/api/questions
  createQuestion: (req, res) => {
    console.log(
      'Mongo posting question to http://localhost:3000/api/questions'
    );
    const { title, frontendQuestionId, difficulty, content, category, topics } =
      req.body;

    // Check if a question with the same title already exists
    Question.findOne({ title })
      .then((existingQuestion) => {
        if (existingQuestion) {
          return res
            .status(400)
            .json({ error: 'Question with this title already exists' });
        }

        const newQuestion = new Question({
          title,
          frontendQuestionId,
          difficulty,
          content,
          category,
          topics,
          isDeleted: false // isDeleted with a default value of false
        });

        newQuestion
          .save()
          .then((question) => {
            res.json(question);
          })
          .catch((error) => {
            res.status(500).json({ error: 'Error creating question' });
          });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error checking for existing question' });
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

    // Check if a question with the same title other than itself already exists
    Question.findOne({ title })
      .then((existingQuestion) => {
        if (existingQuestion && existingQuestion.id != id) {
          return res
            .status(400)
            .json({ error: 'Question with this title already exists' });
        }

        // Update the question
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
        ).then((question) => {
          if (!question) {
            return res.status(404).json({ error: 'Question not found' });
          }
          res.json(question);
        });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error updating question' });
      });
  },
  // Controller function to soft delete a question by ID
  // Usage: Patch request to http://localhost:3000/api/questions/{id}
  softDeleteQuestion: (req, res) => {
    const { id } = req.params; // Get the question ID from the route parameters

    Question.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true } // Set this option to return the updated document
    )
      .then((question) => {
        if (!question) {
          return res.status(404).json({ error: 'Question not found' });
        }
        res.json({ message: 'Question soft deleted successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error soft deleting question' });
      });
  },
  // Extra controller function to delete a question by ID
  // Usage: Delete request to http://localhost:3000/api/questions/{id}
  deleteQuestion: (req, res) => {
    const { id } = req.params; // Get the question ID from the route parameters

    Question.findByIdAndRemove(id)
      .then((question) => {
        if (!question) {
          return res.status(404).json({ error: 'Question not found' });
        }
        res.json({ message: 'Question deleted successfully' });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error deleting question' });
      });
  },
  // Controller function to get a random question via given filters
  // Usage: GET request to http://localhost:3000/api/questions/matched?difficulty=<difficulty_level>&topics=<topics>
  getRandomQuestionByFilter: (req, res) => {
    const { difficulty, topics } = req.query; // Get the difficulty level and topics from the query parameters

    // Define a filter object based on the provided difficulty level and topics
    // Ensure that only questions that are not deleted are retrieved
    const filter = { isDeleted: false };

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (topics) {
      filter.topics = { $regex: `.*${topics}.*`, $options: 'i' }; // Match topics containing <topics> (case-insensitive)
    }

    // Use the aggregate function to select a random question based on the filter
    Question.aggregate([
      { $match: filter }, // Match questions that meet the filter criteria
      { $sample: { size: 1 } }, // Select a random question (adjust 'size' for more questions)
    ])
      .then((questions) => {
        if (questions.length === 0) {
          return res
            .status(404)
            .json({ error: 'No questions found for the given filter' });
        }
        res.json(questions[0]); // Return the random question
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error fetching random question' });
      });
  },
  // Controller function to get all question information for one user
  // Usage: POST request to http://localhost:3000/api/questions/questionbyid
  getQuestionsByIds: (req, res) => {
    const { ids } = req.body; // Get an array of _ids from the request body

    console.log('Getting Questions with IDs:', ids);

    Question.find({ _id: { $in: ids } })
      .then((questions) => {
        if (!questions || questions.length === 0) {
          return res.status(404).json({ error: 'No questions found' });
        }
        res.json(questions);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error fetching questions' });
      });
  },
  // controller function to separate the total number of questions
  // Usage: GET request to http://localhost:3000/api/questions/total
  getQuestionTotal: (req, res) => {
    Question.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          difficulty: '$_id',
          count: 1,
        },
      },
    ])
      .then((question) => {
        res.status(200).json(question);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
