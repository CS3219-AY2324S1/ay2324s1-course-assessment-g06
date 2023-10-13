import { useEffect, useState } from "react";
import { getCurrentUser, deleteUser, logout } from "../services/auth.service";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { NavigateFunction, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Alert, TextField, Typography } from "@mui/material";
import { Formik, Field, Form, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import profilepic from "../images/profilepicture.png";

interface User {
  username: string;
  email: string;
  roles: string[];
  id: string;
}

const Profile: React.FC = () => {
  const currentUser = getCurrentUser();
  const token = currentUser.accessToken;
  const [profile, setProfile] = useState<User | null>(null);
  const [userErrorMessage, setUserErrorMessage] = useState("");
  const [openUpdateUserModel, setOpenUpdateUserModal] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [openUpdatePasswordModel, setOpenUpdatePasswordModal] = useState(false);
  const [openDeleteModel, setOpenDeleteModal] = useState(false);
  const [showPasswordTextFields, setShowPasswordTextFields] = useState(false);

  const toggleTextFields = () => {
    setShowPasswordTextFields(!showPasswordTextFields);
  };

  useEffect(() => {
    const id = getCurrentUser().id;
    axios
      .get(`http://localhost:3003/api/auth/getuser`, {
        headers: {
          "x-access-token": currentUser.accessToken,
        },
      })
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
      await deleteUser();
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
  const toggleUpdateUserModal = () => {
    setOpenUpdateUserModal(!openUpdateUserModel);
  };

  const updateProfileSchema = Yup.object().shape({
    username: Yup.string()
      .test(
        "len",
        "The username must be between 3 and 20 characters.",
        (val: any) =>
          val && val.toString().length >= 3 && val.toString().length <= 20
      )
      .required("This field is required!"),
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
  });

  const updateFormik = useFormik({
    initialValues: {
      username: profile?.username,
      email: profile?.email,
    },
    validationSchema: updateProfileSchema,
    onSubmit: (values, { resetForm }) => {
      axios
        .patch(`http://localhost:3003/api/auth/updateprofile`, values, {
          headers: {
            "x-access-token": currentUser.accessToken,
          },
        })
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
              email: values.email || prevProfile.email,
            };
          });
          setUserErrorMessage("");
          resetForm();
          toggleUpdateUserModal();
        })
        .catch((err) => {
          console.log(err);
          setUserErrorMessage(err.response.data.message);
        });
    },
    enableReinitialize: true,
  });

  //Update Password
  const toggleUpdatePasswordModal = () => {
    setOpenUpdatePasswordModal(!openUpdatePasswordModel);
  };

  const updatePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .test(
        "len",
        "The password is be between 6 and 40 characters.",
        (val: any) =>
          val && val.toString().length >= 6 && val.toString().length <= 40
      )
      .required("This field is required!"),
    newPassword: Yup.string()
      .test(
        "len",
        "The password must be between 6 and 40 characters.",
        (val: any) =>
          val && val.toString().length >= 6 && val.toString().length <= 40
      )
      .required("This field is required!"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), ""], "Passwords must match")
      .required("This field is required!"),
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: updatePasswordSchema,
    onSubmit: (values, { resetForm }) => {
      const { currentPassword, newPassword } = values;
      axios
        .patch(
          `http://localhost:3003/api/auth/updatepassword`,
          { currentPassword, newPassword },
          {
            headers: {
              "x-access-token": token,
            },
          }
        )
        .then((response) => {
          console.log(response);
          setUserErrorMessage("");
          resetForm();
          toggleUpdatePasswordModal();
        })
        .catch((err) => {
          // console.log(err);
          // console.log(err.response.data)
          setPasswordErrorMessage(err.response.data.message);
        });
    },
    enableReinitialize: true,
  });

  return (
    <div className="container">
      <div
        className="jumbotron"
        style={{ borderRadius: "10px", backgroundColor: "#E6E6E6" }}
      >
        <form onSubmit={updateFormik.handleSubmit}>
          <div className="container">
            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-sm-4">
                <div className="d-flex align-items-center justify-content-center">
                  <img src={profilepic} alt="picture" className="img-fluid" />
                </div>
              </div>
              <div className="col-12 col-sm-7">
                <div className="row justify-content-center align-items-center">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <label htmlFor="username" style={{ position: "relative" }}>
                      Username
                    </label>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="username"
                      name="username"
                      type="text"
                      InputLabelProps={{ shrink: false }} // Allow the label to float
                      onChange={updateFormik.handleChange}
                      value={updateFormik.values.username}
                      onBlur={updateFormik.handleBlur}
                      error={
                        updateFormik.touched.username &&
                        Boolean(updateFormik.errors.username)
                      }
                      helperText={
                        updateFormik.touched.username &&
                        updateFormik.errors.username
                      }
                      InputProps={{
                        style: {
                          borderRadius: "20px",
                          backgroundColor: "white",
                        },
                      }}
                      style={{
                        borderRadius: "20px",
                        lineHeight: "3rem",
                        margin: 0,
                        width: "60%",
                        left: "25%",
                      }}
                    />
                  </div>
                </div>
                <div className="row justify-content-center align-items-center">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <label
                      htmlFor="email"
                      style={{
                        position: "relative",
                        paddingRight: "35px",
                      }}
                    >
                      Email
                    </label>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="email"
                      name="email"
                      type="text"
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
                      InputProps={{
                        style: {
                          borderRadius: "20px", // Set the border radius
                          backgroundColor: "white",
                        },
                      }}
                      style={{
                        borderRadius: "20px",
                        lineHeight: "3rem",
                        margin: 0,
                        width: "60%",
                        left: "25%",
                      }}
                    />
                  </div>
                </div>

                {!showPasswordTextFields && (
                  <div className="row justify-content-center align-items-center">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <label
                        htmlFor="password"
                        style={{ position: "relative", paddingRight: "5px" }}
                      >
                        Password
                      </label>
                      <Button
                        onClick={toggleTextFields}
                        style={{
                          backgroundColor: "#D9D9D9",
                          borderRadius: "20px",
                          lineHeight: "2.5rem",
                          margin: 0,
                          width: "60%",
                          left: "25%",
                        }}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                )}

                {showPasswordTextFields && (
                  <>
                    <div className="row justify-content-center align-items-center">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "20px",
                        }}
                      >
                        <label
                          htmlFor="currentPassword"
                          style={{
                            position: "relative",
                            marginRight: "-54px",
                          }}
                        >
                          Current Password
                        </label>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordFormik.values.currentPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                          error={
                            passwordFormik.touched.currentPassword &&
                            Boolean(passwordFormik.errors.currentPassword)
                          }
                          helperText={
                            passwordFormik.touched.currentPassword &&
                            passwordFormik.errors.currentPassword
                          }
                          InputProps={{
                            style: {
                              borderRadius: "20px",
                              backgroundColor: "white",
                            },
                          }}
                          style={{
                            borderRadius: "20px",
                            lineHeight: "3rem",
                            margin: 0,
                            width: "60%",
                            left: "25%",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <label
                        htmlFor="newPassword"
                        style={{
                          position: "relative",
                          marginRight: "-31px",
                        }}
                      >
                        New Password
                      </label>
                      <TextField
                        margin="dense"
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordFormik.values.newPassword}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        error={
                          passwordFormik.touched.newPassword &&
                          Boolean(passwordFormik.errors.newPassword)
                        }
                        helperText={
                          passwordFormik.touched.newPassword &&
                          passwordFormik.errors.newPassword
                        }
                        InputProps={{
                          style: {
                            borderRadius: "20px",
                            backgroundColor: "white",
                          },
                        }}
                        style={{
                          borderRadius: "20px",
                          lineHeight: "3rem",
                          margin: 0,
                          width: "60%",
                          left: "25%",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      <label
                        htmlFor="confirmPassword"
                        style={{
                          position: "relative",
                          marginRight: "-55px",
                        }}
                      >
                        Confirm Password
                      </label>
                      <TextField
                        margin="dense"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordFormik.values.confirmPassword}
                        onChange={passwordFormik.handleChange}
                        onBlur={passwordFormik.handleBlur}
                        error={
                          passwordFormik.touched.confirmPassword &&
                          Boolean(passwordFormik.errors.confirmPassword)
                        }
                        helperText={
                          passwordFormik.touched.confirmPassword &&
                          passwordFormik.errors.confirmPassword
                        }
                        InputProps={{
                          style: {
                            borderRadius: "20px",
                            backgroundColor: "white",
                          },
                        }}
                        style={{
                          borderRadius: "20px",
                          lineHeight: "3rem",
                          margin: 0,
                          width: "60%",
                          left: "25%",
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* <Button onClick={toggleUpdateUserModal}>Cancel</Button> */}

            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-sm-4 d-flex justify-content-center align-items-center">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={toggleDeleteModal}
                    style={{
                      position: "relative",
                      border: "none",
                      textDecoration: "underline",
                      color: "#9BA4B5",
                      background: "none",
                    }}
                  >
                    delete account
                  </button>
                </div>
              </div>
              <div className="col-12 col-sm-7">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      updateFormik.handleSubmit(); // Call the Update Profile method
                      passwordFormik.handleSubmit(); // Call the Update Password method
                    }}
                    style={{
                      backgroundColor: "#D9D9D9",
                      borderRadius: "20px",
                      lineHeight: "2.5rem",
                      margin: 0,
                      width: "97%",
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

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
              Are you sure you want to delete your account?
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
    </div>
  );
};

export default Profile;
