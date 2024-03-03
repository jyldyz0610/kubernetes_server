import React, { useState } from 'react';
import GoogleSignInButton from './GoogleSignInButton';

const Login = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    loginUserName: "",
    loginPassword: "",
    loginType: 1, // Default to Student
  });

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your logic here to handle form submission (e.g., API call)
    console.log("Form submitted:", formData);
    // Reset form fields
    setFormData({
      loginUserName: "",
      loginPassword: "",
      loginType: 1,
    });
  };

  // Function to handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
      <div className="divider d-flex align-items-center my-4">
        <p className="text-center fw-bold mx-3 mb-0 text-muted">Login</p>
      </div>
      <div className="d-none alert alert-danger" role="alert" id="loginAlert">
        User does not exist or your password is incorrect
      </div>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        {/* User Name input */}
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="loginUserName">User Name</label>
          <input
            type="text"
            name="loginUserName"
            id="loginUserName"
            className="form-control form-control-lg"
            value={formData.loginUserName}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <div className="invalid-feedback">
            Please Enter User Name.
          </div>
        </div>
        {/* Password input */}
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="loginPassword">Password</label>
          <input
            type="password"
            name="loginPassword"
            id="loginPassword"
            className="form-control form-control-lg"
            value={formData.loginPassword}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <div className="invalid-feedback">
            Please Enter Password.
          </div>
        </div>
        {/* Radio buttons for login type */}
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="loginType"
            id="admin"
            value="0"
            checked={formData.loginType === "0"}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="admin">Admin</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="loginType"
            id="student"
            value="1"
            checked={formData.loginType === "1"}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="student">Student</label>
        </div>
        <br /><br />
        {/* Submit button */}
        <div className="d-flex justify-content-between align-items-center">
          <button type="submit" id="btnLogin" className="btn btn-primary btn-lg">Sign in</button>
          <p>or</p>
          <GoogleSignInButton />
        </div>
      </form>
    </div>
  );
};

export default Login;
