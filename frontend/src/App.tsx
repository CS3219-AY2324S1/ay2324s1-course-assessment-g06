import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./Table/Table";
import BasicTable from "./Table/Table";
import Question from "./Question/Question";
import Matching from "./Matching/Matching";
import CodeSpace from "./Matching/CodeSpace";
import AddQuestionForm from "./AddQuestionForm/AddQuestionForm";
import UpdateQuestionForm from "./UpdateQuestionForm/UpdateQuestionForm";
import { useState, useEffect } from "react";
import * as AuthService from "./services/auth.service";
import IUser from './types/user.type';
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Protected from "./components/Protected";
// import BoardUser from "./components/BoardUser";
// import BoardModerator from "./components/BoardModerator";
// import BoardAdmin from "./components/BoardAdmin";
import EventBus from "./common/EventBus";


const App: React.FC = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
  // const [currentUser, setCurrentUser] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<boolean>(()=>localStorage.getItem("user")?true:false);

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
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          PeerPrep
        </Link>
        <div className="navbar-nav mr-auto">
          {/* <li className="nav-item">
            <Link to={"/home"} className="nav-link">
              Home
            </Link>
          </li> */}

          {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">
                Moderator Board
              </Link>
            </li>
          )}

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Board
              </Link>
            </li>
          )}

          {currentUser && (
            <li className="nav-item">
              <Link to={"/user"} className="nav-link">
                User
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                profile
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<><p><Link to="/questions">Go to Questions</Link></p></>} />
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <Protected isLoggedIn={currentUser}>
              <Profile />
            </Protected>} />
          {/* <Route path="/user" element={<BoardUser />} />
          <Route path="/mod" element={<BoardModerator />} />
          <Route path="/admin" element={<BoardAdmin />} /> */}
          {/* Can only access questions if there is logged in user */}
          <Route path="/questions" element={
              <BasicTable />
          } />
          <Route path="/questions/:id" element={<Question />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/match/:roomId" element={<CodeSpace />} />
          <Route path="/questions/:id/update" element={<UpdateQuestionForm />} />
          <Route path="/questions/add-question" element={<AddQuestionForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
