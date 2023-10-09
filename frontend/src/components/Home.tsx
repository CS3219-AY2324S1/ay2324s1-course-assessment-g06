import React from "react";
import mascot from '../images/mascot.png';

const Home: React.FC = () => {
  const buttonStyles = {
    backgroundColor: '#6C63FF',
    color: 'white',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 'bold',
    height: '50px',
    borderRadius: '15px',
    border: 'none',
    cursor: 'pointer',
    margin: '0.5rem',
    padding: '0 2.5rem',
  };

  return (
    <div className="container">
      <div className="row align-items-center justify-content-center">
        <div className="col-md-5 m-0">
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '4rem',
          }}>
            Coding 
            <br/>
            Together
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '2.2rem',
          }}>
            has never been easier
          </p>
          <div className="col-md-8 text-center">
            <div className="d-flex justify-content-between"> {/* Wrap buttons in a flex container */}
              <button
                style={buttonStyles}
                onClick={() => alert("Login clicked")}
              >
                Login
              </button>
              <button
                style={buttonStyles}
                onClick={() => alert("Sign Up clicked")}
              >
                Sign Up
              </button>
            </div>
          </div>
          <div className="col-md-" />
        </div>
        <div className="col-md-7 d-flex align-items-center justify-content-center">
          <img
            src={mascot}
            alt="mascot"
            style={{
              height: 'auto',
              maxWidth: '100%',
              width: 'auto',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
