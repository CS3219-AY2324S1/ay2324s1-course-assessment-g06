import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import "./Table/Table";
import BasicTable from "./Table/Table";
import Question from "./Question/Question";
import Matching from "./Matching/Matching";
import CodeSpace from "./Matching/CodeSpace";
import AddQuestionForm from "./AddQuestionForm/AddQuestionForm";
import UpdateQuestionForm from "./UpdateQuestionForm/UpdateQuestionForm";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<><p><Link to="/questions">Go to Questions</Link></p></>} />
        <Route path="/questions" element={<BasicTable />} />
        <Route path="/questions/:id" element={<Question />} />        
        <Route path="/matching" element={<Matching />} />
        <Route path="/match/:roomId" element={<CodeSpace />} />
        <Route path="/questions/:id/update" element={<UpdateQuestionForm />} />
        <Route path="/questions/add-question" element={<AddQuestionForm />} />
      </Routes>
    </div>
  );
}

export default App;
