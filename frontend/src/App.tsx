import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import BasicTable from "./Table/Table";
import Question from "./Question/Question";
import Matching from "./components/Matching/Matching";
import CodeSpace from "./components/Matching/CodeSpace";
import AddQuestionForm from "./AddQuestionForm/AddQuestionForm";
import UpdateQuestionForm from "./UpdateQuestionForm/UpdateQuestionForm";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import $ from 'jquery'; // Import jQuery
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JavaScript (with Popper.js included)
import * as AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Protected from "./components/Protected";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import GuestRoute from "./components/GuestRoute";
import EventBus from "./common/EventBus";
import logo from './images/peerPrepLogo.png';


import "./App.css";
import "./Table/Table";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<boolean>(() =>
    localStorage.getItem("user") ? true : false
  );
  const location = useLocation(); // Get the current location
  const isCodeSpaceRoute = location.pathname.startsWith('/match/');

  // State variable to control the menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu when a navigation link is clicked
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  function generateActiveStyle(path: string) {
    return {
      borderBottom: location.pathname === path ? "5px solid #6C63FF" : "5px solid transparent",
    };
  }

  useEffect(() => {
    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(false);
  };


  return (
    <div>
      {isCodeSpaceRoute ? null : (
        <nav className="navbar navbar-default navbar-expand-lg navbar-light bg-white p-2">
          {/* Logo and navigation links */}
          <Link to={"/"} className="navbar-brand">
            <img src={logo} alt="Logo" height="50" width="160" className="logo-img" />
          </Link>

          {/* Hamburger icon button */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {currentUser ? (
            <>

              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
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
                  <li className="nav-item ">
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
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
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
                </ul>
              </div>
            </>
          )}
        </nav>
      )}

      {/* */}

      <div className={`${isCodeSpaceRoute ? '' : ' container mt-3'}`}>
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

