import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import BasicTable from "./pages/Question/QuestionsTable";
import Question from "./pages/Question/ViewQuestion";
import AddQuestionForm from "./pages/Question/AddQuestion";
import UpdateQuestionForm from "./pages/Question/UpdateQuestion";
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
