import {useEffect,useState} from "react";
import { getCurrentUser, deleteUser, logout } from "../services/auth.service";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { NavigateFunction, useNavigate, useLocation } from "react-router-dom";


const Profile: React.FC = () => {
  const currentUser = getCurrentUser();
  // const location = useLocation();
  // const setCurrentUser = location.state;
  let navigate: NavigateFunction = useNavigate();
  // delete code
  const [openDeleteModel, setOpenDeleteModal] = useState(false);
  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModel);
  }

  const deleteUserAccount = async () => {
    try {
      await deleteUser(currentUser.id);
      logout();
    } catch (err) {
      // useState to log api error?
      console.log(err);
    } finally {
      // need to figure out how to not force it without context
      navigate("/login");
      window.location.reload();
    }
  };
  // update user

  // update password
  
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role: string, index: number) => <li key={index}>{role}</li>)}
      </ul>
      <button onClick={toggleDeleteModal}>Delete</button>
      <button>update profile</button>
      <button>change password</button>
      <Dialog
        open={openDeleteModel}
        onClose={toggleDeleteModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete your account? ${currentUser.username}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
           "Are you sure you want to delete your account?"
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDeleteModal}>Disagree</Button>
          <Button onClick={deleteUserAccount} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;