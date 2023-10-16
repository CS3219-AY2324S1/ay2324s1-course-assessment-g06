import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import "./Table/Table";
import BasicTable from "./Table/Table";
import Question from "./Question/Question";
import Matching from "./components/Matching/Matching";
import CodeSpace from "./components/Matching/CodeSpace";
import AddQuestionForm from "./AddQuestionForm/AddQuestionForm";
import UpdateQuestionForm from "./UpdateQuestionForm/UpdateQuestionForm";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import * as AuthService from "./services/auth.service";
import IUser from "./types/user.type";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Protected from "./components/Protected";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import GuestRoute from "./components/GuestRoute";
// import BoardUser from "./components/BoardUser";
// import BoardModerator from "./components/BoardModerator";
// import BoardAdmin from "./components/BoardAdmin";
import EventBus from "./common/EventBus";
import logo from './images/peerPrepLogo.png';


const App: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<boolean>(() =>
    localStorage.getItem("user") ? true : false
  );
  const location = useLocation(); // Get the current location

  function generateActiveStyle(path: string) {
    return {
      borderBottom: location.pathname === path ? "5px solid #6C63FF" : "none",
    };
  }

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      // setCurrentUser(true);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(false);
  };

  return (
    <div>
  <nav className="navbar navbar-expand navbar-light bg-white p-3"> 
        <Link to={"/"} className="navbar-brand">
          <img src={logo} alt="Logo" height="50" width="160" className="logo-img" />;
        </Link>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/"} className="nav-link" style={generateActiveStyle("/")}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/matching"} className="nav-link" style={generateActiveStyle("/matching")}>
                Matching
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/questions"} className="nav-link" style={generateActiveStyle("/questions")}>
                Questions
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link" style={generateActiveStyle("/profile")}>
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                Log Out
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
            <Link to={"/login"} className="nav-link" style={generateActiveStyle("/login")}>
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link" style={generateActiveStyle("/register")}>
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <GuestRoute isLoggedIn={currentUser}>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute isLoggedIn={currentUser}>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected isLoggedIn={currentUser}>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/questions"
            element={
              <Protected isLoggedIn={currentUser}>
                <BasicTable />
              </Protected>
            }
          />
          <Route
            path="/questions/:id"
            element={
              <Protected isLoggedIn={currentUser}>
                <Question />
              </Protected>
            }
          />
          <Route
            path="/matching"
            element={
              <Protected isLoggedIn={currentUser}>
                <Matching />
              </Protected>
            }
          />
          <Route
            path="/match/:roomId"
            element={
              <Protected isLoggedIn={currentUser}>
                <CodeSpace />
              </Protected>
            }
          />
          <Route
            path="/questions/:id/update"
            element={
              <Protected isLoggedIn={currentUser}>
                <UpdateQuestionForm />
              </Protected>
            }
          />
          <Route path="/questions/add-question" element={<AddQuestionForm />} />

          <Route path="*" element={<PageNotFound />} />
        
        </Routes>

        
      </div>
    </div>
  );
};

export default App;

