const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: String,
  frontendQuestionId: Number,
  difficulty: String,
  content: String,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
