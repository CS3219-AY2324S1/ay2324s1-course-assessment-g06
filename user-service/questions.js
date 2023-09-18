const express = require("express");
const mongoose = require("mongoose");
const app = express();

// MongoDB Atlas credentials
const username = encodeURIComponent("testUser");
const password = encodeURIComponent("Z4kBuJ8OOL8fs2DP");
const clusterUrl = "cluster69508.3w1nmj1.mongodb.net";
const dbName = "questions";

// Connection URI for MongoDB Atlas
const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/${dbName}?retryWrites=true&w=majority`;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    // getQuestions(); // Function to get all questions after connecting
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Define a schema for the questions
const questionSchema = new mongoose.Schema({
  title: String,
  frontendQuestionId: Number,
  difficulty: String,
  content: String,
});

// Define a model based on the schema
const Question = mongoose.model("Question", questionSchema);

// Define an API route to retrieve questions
app.get("/api/questions", (req, res) => {
  Question.find({}, "title frontendQuestionId difficulty")
    .then((questions) => {
      res.json(questions); // Send the selected fields as a JSON response
    })
    .catch((error) => {
      console.error("Error retrieving questions:", error);
      res.status(500).json({ message: "Internal server error" }); // Handle errors
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// // Function to retrieve questions from MongoDB
// function getQuestions() {
//   Question.find()
//     .then((questions) => {
//       questions.forEach((question) => {
//         console.log("Title:", question.title);
//         console.log("frontendQuestionId:", question.frontendQuestionId);
//         console.log("Difficulty:", question.difficulty);
//         console.log("Content:", question.content);
//         console.log("-".repeat(40));
//       });

//       console.log(`Number of questions retrieved: ${questions.length}`);
//     })
//     .catch((error) => {
//       console.error("Error retrieving questions:", error);
//     })
//     .finally(() => {
//       mongoose.connection.close(); // Close the connection when done
//     });
// }
