// Login.tsx
import React, { useState } from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import mascot from '../images/mascot.png';
import { Link } from "react-router-dom";


import { login } from "../services/auth.service";

type Props = {}

const Login: React.FC<Props> = () => {
  let navigate: NavigateFunction = useNavigate();
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues: {
    username: string;
    password: string;
  } = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;

    login(username, password)
    .then((response) => {
      setSuccessful(true);
      navigate("/profile");
      window.location.reload();
    })
    .catch((error) => {
      setSuccessful(false);
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred.");
      }
    });
  };

  const mascotStyles = {
    height: 'auto',
    maxWidth: '100%',
    width: 'auto',
  };

  return (
    <div className="container">
      <div className="row align-items-center justify-content-center">
        <div className="col-md-5">
          <div className="col-md-10 mx-auto">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                 {!successful && (
                  <div>
              <div className="form-floating mb-3">
                <Field
                  name="username"
                  type="text"
                  className="form-control input-lg"
                  id="floatingUsername"
                  placeholder=" "
                  style={{ borderRadius: "15px" }}
                />
                <label
                  htmlFor="floatingUsername"
                  style={{
                    paddingLeft: '10px',
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingRight: 0,
                    lineHeight: '3rem',
                    margin: 0,
                  }}
                >
                  Username
                </label>
                <ErrorMessage
                  name="username"
                  component="div"
                  className="alert alert-danger"
                />
              </div>

              <div className="form-floating">
                <Field
                  name="password"
                  type="password"
                  className="form-control input-lg"
                  id="floatingPassword"
                  placeholder=" "
                  style={{ borderRadius: "15px" }}
                />
                <label
                  htmlFor="floatingPassword"
                  style={{
                    paddingLeft: '10px',
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingRight: 0,
                    margin: 0,
                    lineHeight: '3rem',
                  }}
                >
                  Password
                </label>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="alert alert-danger"
                />
              </div>
              
              <div className="form-group mt-3 d-flex align-items-center">
              <div className="col-md-5" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.5)'  }}>
                No Account?
                <br/>
                <Link to="/register" style={{ textDecoration: 'underline', color: 'rgba(0, 0, 0, 0.5)' }}>
                  Sign up
                </Link>
              </div>
                <div className="col-md-2" />
                <div className="col-md-5 text-center">
                  <button
                    type="submit"
                    className="btn btn-block rounded-pill"
                    style={{
                      backgroundColor: '#6C63FF',
                      color: 'white',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 'bold',
                      height: '50px',
                    }}
                  >
                    Login
                  </button>
                  </div>
                </div>
              </div>
              )}

              {message && (
                    <div className="form-group">
                      <div
                        className="alert alert-danger"
                        role="alert"
                      >
                      {message}
                      </div>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>

        <div className="col-md-7 d-flex align-items-center justify-content-center">
          <img src={mascot} alt="mascot" style={mascotStyles} />
        </div>
      </div>
    </div>
  );
};

export default Login;
