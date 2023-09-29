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
import { Alert, TextField } from '@mui/material';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';

interface User {
  username: string;
  email: string;
  roles: string[];
  id: string;
}

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();
  const [profile, setProfile] = useState<User | null>(null);
  const [userErrorMessage, setUserErrorMessage] = useState('');
  const [openUpdateUserModel, setOpenUpdateUserModal] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [openUpdatePasswordModel, setOpenUpdatePasswordModal] = useState(false);
  const [openDeleteModel, setOpenDeleteModal] = useState(false);

  useEffect(() => {
    const id = getCurrentUser().id;
    axios
      .get(`http://localhost:3001/api/auth/getuser/${id}`)
      .then((response) => {
        setProfile(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // const location = useLocation();
  // const setCurrentUser = location.state;
  let navigate: NavigateFunction = useNavigate();
  // delete code
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
  const toggleUpdateUserModal = () => {
    setOpenUpdateUserModal(!openUpdateUserModel);
  };

  const updateProfileSchema = Yup.object().shape({
    username: Yup.string()
      .test(
        'len',
        'The username must be between 3 and 20 characters.',
        (val: any) =>
          val && val.toString().length >= 3 && val.toString().length <= 20
      )
      .required('This field is required!'),
    email: Yup.string()
      .email('This is not a valid email.')
      .required('This field is required!'),
  });

  const updateFormik = useFormik({
    initialValues: {
      username: profile?.username,
      email: profile?.email,
    },
    validationSchema: updateProfileSchema,
    onSubmit: (values, { resetForm }) => {
      axios
        .patch(
          `http://localhost:3001/api/auth/updateprofile/${currentUser.id}`,
          values
        )
        .then((response) => {
          console.log(response);
          // console.log(values);
          setProfile((prevProfile) => {
            if (!prevProfile) {
              return null;
            } 
            return {
              ...prevProfile,
              username: values.username || prevProfile.username,
              email: values.email || prevProfile.email
            }
          });
          setUserErrorMessage('');
          resetForm();
          toggleUpdateUserModal();
        })
        .catch((err) => {
          console.log(err);
          setUserErrorMessage(err.message);
        });
    },
    enableReinitialize: true,
  });
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
      {/* delete user */}
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
      {/* update profile */}
      <div>
        <Dialog open={openUpdateUserModel} onClose={toggleUpdateUserModal}>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogContent>
            <form onSubmit={updateFormik.handleSubmit}>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                onChange={updateFormik.handleChange}
                value={updateFormik.values.email}
                onBlur={updateFormik.handleBlur}
                error={
                  updateFormik.touched.email &&
                  Boolean(updateFormik.errors.email)
                }
                helperText={
                  updateFormik.touched.email && updateFormik.errors.email
                }
              />
              <TextField
                autoFocus
                margin="dense"
                id="username"
                name="username"
                label="UserName"
                type="text"
                fullWidth
                variant="standard"
                onChange={updateFormik.handleChange}
                value={updateFormik.values.username}
                onBlur={updateFormik.handleBlur}
                error={
                  updateFormik.touched.username &&
                  Boolean(updateFormik.errors.username)
                }
                helperText={
                  updateFormik.touched.username && updateFormik.errors.username
                }
              />
              <DialogActions>
                <Button onClick={toggleUpdateUserModal}>Cancel</Button>
                <Button type="submit">Submit</Button>
              </DialogActions>
            </form>
          </DialogContent>
          {userErrorMessage && (
          <div>
            <Alert severity="error">{userErrorMessage}</Alert>
          </div>)}
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
