import { useEffect, useState } from 'react';
import { getCurrentUser, deleteUser, logout } from '../services/auth.service';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { NavigateFunction, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { TextField } from '@mui/material';

interface User {
  username: string;
  email: string;
  roles: string[];
  id: string;
}

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();
  const [profile, setProfile] = useState<User | null>(null);

  const [openUpdateUserModel, setOpenUpdateUserModal] = useState(false);
  const toggleUpdateUserModal = () => {
    setOpenUpdateUserModal(!openUpdateUserModel);
  };

  useEffect(() => {
    const id = getCurrentUser().id;
    axios
      .get(`http://localhost:3001/api/auth/getuser/${id}`)
      .then((response) => {
        setProfile(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }, []);
  // const location = useLocation();
  // const setCurrentUser = location.state;
  let navigate: NavigateFunction = useNavigate();
  // delete code
  const [openDeleteModel, setOpenDeleteModal] = useState(false);
  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModel);
  };
  

  const deleteUserAccount = async () => {
    try {
      await deleteUser(currentUser.id);
      logout();
    } catch (err) {
      // useState to log api error?
      console.log(err);
    } finally {
      // need to figure out how to not force it without context
      navigate('/login');
      window.location.reload();
    }
  };
  // update user
  const updateUserAccount = async () => {
    try {

    } catch (err) {
      console.log(err);
    } finally {
      
    }
  }
  // update password

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{profile?.username}</strong> Profile
        </h3>
      </header>
      {/* <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{' '}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p> */}
      <p>
        <strong>Id:</strong> {profile?.id}
      </p>
      <p>
        <strong>Email:</strong> {profile?.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {profile?.roles &&
          profile?.roles.map((role: string, index: number) => (
            <li key={index}>{role}</li>
          ))}
      </ul>
      <button onClick={toggleDeleteModal}>Delete</button>
      <button onClick={toggleUpdateUserModal}>update profile</button>
      <button>change password</button>
      <div>
      <Dialog
        open={openDeleteModel}
        onClose={toggleDeleteModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete your account? ${profile?.username}`}
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
      <div>
      <Dialog open={openUpdateUserModel} onClose={toggleUpdateUserModal}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            defaultValue={profile?.email}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            defaultValue={profile?.email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleUpdateUserModal}>Cancel</Button>
          <Button onClick={() => {console.log('e')}}>Subscribe</Button>
        </DialogActions>
      </Dialog> 
      </div>
    </div>
  );
};

export default Profile;
