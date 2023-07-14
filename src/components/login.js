import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import PostForm from "./PostForm";
import '../styles/login.css';

const Login = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggleForm = () => {
    setIsFlipped(!isFlipped);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        loginForm
      );
      const { token } = response.data;
      localStorage.setItem("token", token); // Store the token in local storage
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/register",
        registerForm
      );
      console.log(response.data); // Handle the response as needed
      setShowSuccessModal(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
        setShowErrorModal(true);
      } else {
        console.error(error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token from local storage
    setIsLoggedIn(false);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="container">
      {!isLoggedIn ? (
        <div className={`flip-card ${isFlipped ? "flipped" : ""}`}>
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <h1>Login</h1>
              <form onSubmit={handleLoginSubmit}>
                {/* Login form fields */}
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
                <p>
                  Not registered?{" "}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={handleToggleForm}
                  >
                    Register
                  </button>
                </p>
              </form>
            </div>
            <div className="flip-card-back">
              <h1>Register</h1>
              <form onSubmit={handleRegisterSubmit}>
                {/* Register form fields */}
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
                <p>
                  Already registered?{" "}
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={handleToggleForm}
                  >
                    Login
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <PostForm />
      )}

      <Modal show={showSuccessModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your registration was successful. You can now log in with your
            credentials.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registration Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;
