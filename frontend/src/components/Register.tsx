import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import IUser from "../types/user.type";
import { register } from "../services/auth.service";
import mascot from '../images/mascot.png';
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues: IUser = {
    username: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .test(
        "len",
        "The username must be between 3 and 20 characters.",
        (val: any) =>
          val &&
          val.toString().length >= 3 &&
          val.toString().length <= 20
      )
      .required("This field is required!"),
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    password: Yup.string()
      .test(
        "len",
        "The password must be between 6 and 40 characters.",
        (val: any) =>
          val &&
          val.toString().length >= 6 &&
          val.toString().length <= 40
      )
      .required("This field is required!"),
  });

  const handleRegister = (formValue: IUser) => {
    const { username, email, password } = formValue;

    register(username, email, password).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
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
              onSubmit={handleRegister}
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
                            paddingLeft: "10px",
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingRight: 0,
                            lineHeight: "3rem",
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

                      <div className="form-floating mb-3">
                        <Field
                          name="email"
                          type="email"
                          className="form-control input-lg"
                          id="floatingEmail"
                          placeholder=" "
                          style={{ borderRadius: "15px" }}
                        />
                        <label
                          htmlFor="floatingEmail"
                          style={{
                            paddingLeft: "10px",
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingRight: 0,
                            lineHeight: "3rem",
                            margin: 0,
                          }}
                        >
                          Email
                        </label>
                        <ErrorMessage
                          name="email"
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
                            paddingLeft: "10px",
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingRight: 0,
                            margin: 0,
                            lineHeight: "3rem",
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
                          Account exists?
                          <br/>
                          <Link to="/login" style={{ textDecoration: 'underline', color: 'rgba(0, 0, 0, 0.5)' }}>
                            Login
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
                              Sign Up
                            </button>
                          </div>
                        </div>
                    </div>
                  )}

                  {message && (
                    <div className="form-group">
                      <div
                        className={
                          successful
                            ? "alert alert-success"
                            : "alert alert-danger"
                        }
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

export default Register;
