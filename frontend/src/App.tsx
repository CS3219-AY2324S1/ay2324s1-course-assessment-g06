import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./Table/Table";
import BasicTable from "./Table/Table";
import Question from "./Question/Question";
import QuestionForm from "./QuestionForm/QuestionForm";
import UpdateForm from "./UpdateForm/UpdateForm";
import Matching from "./Matching/Matching";
import CodeSpace from "./Matching/CodeSpace";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<BasicTable />} />
        <Route path="/questions/:id" element={<Question />} />
        <Route path="/questions/:id/update" element={<UpdateForm />} />
        <Route path="/questions/add-question" element={<QuestionForm />} />
        
        <Route path="/matching" element={<Matching />} />
        <Route path="/match/:roomId" element={<CodeSpace />} />
      </Routes>
    </div>
  );
}

export default App;
