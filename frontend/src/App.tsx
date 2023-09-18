import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./Table/Table";
import BasicTable from "./Table/Table";
import Question from "./Question/Question";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<BasicTable />} />
        <Route path="/questions/:frontendQuestionId" element={<Question />} />
      </Routes>
    </div>
  );
}

export default App;
