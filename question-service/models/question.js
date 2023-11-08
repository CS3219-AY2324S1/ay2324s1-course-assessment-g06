const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: String,
  frontendQuestionId: String,
  difficulty: String,
  content: String,
  category: String,
  topics: String,
  isDeleted: { type: Boolean, default: false },
}, {collection: 'serverless'});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
