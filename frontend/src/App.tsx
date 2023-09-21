import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./Table/Table";
import BasicTable from "./Table/Table";
import Question from "./Question/Question";
import QuestionForm from "./QuestionForm/QuestionForm";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<BasicTable />} />
        <Route path="/questions/:id" element={<Question />} />
        <Route path="/questions/add-question" element={<QuestionForm />} />
      </Routes>
    </div>
  );
}

export default App;
