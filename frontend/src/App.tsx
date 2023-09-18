import { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import styled from '@emotion/styled';
import { AppBar, Button, Toolbar, Typography, Container } from '@mui/material';

import AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import EventBus from "./common/EventBus";


type Props = {};

type State = {
  currentUser: IUser | undefined
}

const StyledAppBar = styled(AppBar)`
  margin-bottom: 40px;
  background-color: #999;
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getLoggedInUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }

    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div>
        <>
        <StyledAppBar position="static">
        <StyledToolbar>
          <Typography variant="h6">
            PeerPrep
          </Typography>
          <div>
            {/* Temporary Button to test out */}
            <Link to={"/login"}>
            <Button color="inherit">Login</Button>
            </Link>
            <Link to={"/register"}>
            <Button color="inherit">Register</Button>
            </Link>

            <Button color="inherit">Home</Button>
            {currentUser ? (
              <Button color="inherit" disabled={false}>Collaborate</Button>
            ) : (
              <Button color="inherit" disabled={true}>Collaborate</Button>
            )}
            {currentUser ? (
              <Button color="inherit" disabled={false}>Language</Button>
            ) : (
              <Button color="inherit" disabled={true}>Language</Button>
            )}
          </div>
        </StyledToolbar>
        </StyledAppBar>
        </>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;