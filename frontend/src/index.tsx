import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import BasicTable from "./pages/Table/Table";
import Question from "./pages/Question/Question";
import Matching from "./pages/Matching/Matching";
import CodeSpace from "./pages/Matching/CodeSpace";
import AddQuestionForm from "./pages/AddQuestionForm/AddQuestionForm";
import UpdateQuestionForm from "./components/UpdateQuestionForm/UpdateQuestionForm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

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
