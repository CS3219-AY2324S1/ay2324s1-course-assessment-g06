import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import BasicTable from "./Table/Table";
import Question from "./Question/Question";
import Matching from "./components/Matching/Matching";
import CodeSpace from "./components/Matching/CodeSpace";
import AddQuestionForm from "./AddQuestionForm/AddQuestionForm";
import UpdateQuestionForm from "./UpdateQuestionForm/UpdateQuestionForm";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/questions",
        element: <BasicTable />
      },
      {
        path: "/questions/:id",
        element: <Question />
      },
      {
        path: "/matching",
        element: <CodeSpace />
      },
      {
        path: "/questions/:id/updat",
        element: <UpdateQuestionForm />
      },
      {
        path: "/questions/add-question",
        element: <AddQuestionForm />
      },
    ]
  }
]);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
reportWebVitals();
