import React, { useState } from 'react';
import axios from 'axios';

function SignUpForm() {
  const [state, setState] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const handleChange = evt => {
    const { name, value } = evt.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOnSubmit = async evt => {
    evt.preventDefault();

    const { email, password, confirmPassword } = state;

    // Validation checks
    
    if (email === "") {
      setEmailError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if(!/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,10}$/.test(password) && confirmPassword===""){
      setPasswordError("Password should be alphanumeric and not more than 10 characters");
      return;
    }
    if (password === "") {
      setPasswordError("Password is required");
      return;
    }
    if (password!==confirmPassword && confirmPassword!=="" && !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,10}$/.test(confirmPassword)){
      setConfirmPasswordError("Password don't match");
      return;
    }
    if(password === !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,10}$/.test(password) && password!== "" && confirmPassword === ""){
      setConfirmPasswordError("Please confirm your password");
      return;
    }

    try {
      console.log('Going to backend');
      // Send data to backend
      const response = await axios.post('http://localhost:3000/', {
        email,
        password
      });
      console.log(response);
      if (response.status === 201) {
        console.log('Registration successful');
        setState({
          email: "",
          password: "",
          confirmPassword: ""
        });
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setRegistrationError(""); // Clear any previous error
      } else {
        console.log(response);
        setRegistrationError("Registration failed. Please try again."); // Set registration error message
      }
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data.message : error.message);
      setRegistrationError("Registration failed. Please try again."); // Set registration error message
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <span>or use your email for registration</span>
        <input
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {emailError && <span style={{ color: "red" }}>{emailError}</span>}
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {passwordError && <span style={{ color: "red" }}>{passwordError}</span>}
        <input
          type="password"
          name="confirmPassword"
          value={state.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        {confirmPasswordError && <span style={{ color: "red" }}>{confirmPasswordError}</span>}
        {registrationError && <p style={{ color: "red" }}>{registrationError}</p>} {/* Display registration error message */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
