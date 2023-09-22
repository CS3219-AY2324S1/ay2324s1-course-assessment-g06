import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./Table/Table";
import BasicTable from "./Table/Table";
import Question from "./Question/Question";
import AddQuestionForm from "./AddQuestionForm/AddQuestionForm";
import UpdateQuestionForm from "./UpdateQuestionForm/UpdateQuestionForm";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/questions" element={<BasicTable />} />
        <Route path="/questions/:id" element={<Question />} />
        <Route path="/questions/:id/update" element={<UpdateQuestionForm />} />
        <Route path="/questions/add-question" element={<AddQuestionForm />} />
      </Routes>
    </div>
  );
}

export default App;
