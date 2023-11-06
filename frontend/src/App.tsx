import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import BasicTable from "./Table/Table";
import Question from "./Question/Question";
import Matching from "./components/Matching/Matching";
import CodeSpace from "./components/Matching/CodeSpace";
import AddQuestionForm from "./AddQuestionForm/AddQuestionForm";
import UpdateQuestionForm from "./UpdateQuestionForm/UpdateQuestionForm";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import $ from "jquery"; // Import jQuery
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JavaScript (with Popper.js included)
import * as AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Protected from "./components/Protected/Protected";
import AdminProtected from "./components/AdminProtected/AdminProtected";
import ErrorPage from "./components/ErrorPage";
import GuestRoute from "./components/GuestRoute";
import EventBus from "./common/EventBus";
import logo from "./images/peerPrepLogo.png";
import Analytics from "./components/Analytics";

import "./App.css";
import "./Table/Table";
import UserAttempt from "./UserAttempt/UserAttempt";
import { getCurrentUser } from "./services/auth.service";

const App: React.FC = () => {
  console.log("QNS_SVC: ", process.env.REACT_APP_QNS_SVC);
  console.log("MTC_SVC: ", process.env.REACT_APP_MTC_SVC);
  console.log("REACT_APP_USR_SVC_HIST: ", process.env.REACT_APP_USR_SVC_HIST);
  console.log("REACT_APP_USR_SVC_AUTH: ", process.env.REACT_APP_USR_SVC_AUTH);
  console.log("REACT_APP_USR_SVC_USER: ", process.env.REACT_APP_USR_SVC_USER);
  const [currentUser, setCurrentUser] = useState<boolean>(() =>
    localStorage.getItem("user") ? true : false
  );

  const [currentUserAccessToken, setCurrentUserAccessToken] = useState<string>(() => {
    return getCurrentUser()?.accessToken || "";
  });

  const location = useLocation(); // Get the current location
  const isCodeSpaceRoute = location.pathname.startsWith("/match/");

  const [isDropdownOpen, setDropdownOpen] = useState(false); // State variable for dropdown menu

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  function generateActiveStyle(path: string) {
    return {
      borderBottom:
        location.pathname === path
          ? "5px solid #6C63FF"
          : "5px solid transparent",
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
            <img
              src={logo}
              alt="Logo"
              height="50"
              width="160"
              className="logo-img"
            />
          </Link>

          {/* Hamburger icon button */}
          <button
            className="navbar-toggler"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {currentUser ? (
            <>
              <div
                className={`navbar-collapse collapse ${
                  isDropdownOpen ? "show" : ""
                }`}
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link
                      to={"/"}
                      className="nav-link"
                      onClick={() => setDropdownOpen(false)}
                      style={generateActiveStyle("/")}
                    >
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to={"/matching"}
                      className="nav-link"
                      onClick={() => setDropdownOpen(false)}
                      style={generateActiveStyle("/matching")}
                    >
                      Matching
                    </Link>
                  </li>
                  <li className="nav-item ">
                    <Link
                      to={"/questions"}
                      className="nav-link"
                      onClick={() => setDropdownOpen(false)}
                      style={generateActiveStyle("/questions")}
                    >
                      Questions
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to={"/profile"}
                      className="nav-link"
                      onClick={() => setDropdownOpen(false)}
                      style={generateActiveStyle("/profile")}
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="/" className="nav-link" onClick={logOut}>
                      Log Out
                    </a>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div
                className={`navbar-collapse collapse ${
                  isDropdownOpen ? "show" : ""
                }`}
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link
                      to={"/login"}
                      className="nav-link"
                      onClick={() => setDropdownOpen(false)}
                      style={generateActiveStyle("/login")}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to={"/register"}
                      className="nav-link"
                      onClick={() => setDropdownOpen(false)}
                      style={generateActiveStyle("/register")}
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </nav>
      )}

      <div className={`${isCodeSpaceRoute ? "" : " container mt-3"}`}>
        <Routes>
          <Route
            path="/"
            element={
              <GuestRoute isLoggedIn={currentUser}>
                <Home />
              </GuestRoute>
            }
          />
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
              <Protected token={currentUserAccessToken}>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/questions"
            element={
              <Protected token={currentUserAccessToken}>
                <BasicTable />
              </Protected>
            }
          />
          <Route
            path="/questions/:id"
            element={
              <Protected token={currentUserAccessToken}>
                <Question />
              </Protected>
            }
          />
          <Route
            path="/matching"
            element={
              <Protected token={currentUserAccessToken}>
                <Matching />
              </Protected>
            }
          />
          <Route
            path="/home"
            element={
              <Protected token={currentUserAccessToken}>
                <Analytics />
              </Protected>
            }
          />
          <Route
            path="/match/:roomId"
            element={
              <Protected token={currentUserAccessToken}>
                <CodeSpace />
              </Protected>
            }
          />
          <Route
            path="/questions/:id/update"
            element={
              <Protected token={currentUserAccessToken}>
                <AdminProtected token={currentUserAccessToken}>
                  <UpdateQuestionForm />
                </AdminProtected>
              </Protected>
            }
          />
          <Route
            path="/home/:id"
            element={
              <Protected token={currentUserAccessToken}>
                <UserAttempt />
              </Protected>
            }
          />
          <Route path="/questions/add-question" element={
            <Protected token={currentUserAccessToken}>
              <AdminProtected token={currentUserAccessToken}>
                <AddQuestionForm />
              </AdminProtected>
            </Protected>
            } />
          <Route path="*" element={<ErrorPage errorCode="404"/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

