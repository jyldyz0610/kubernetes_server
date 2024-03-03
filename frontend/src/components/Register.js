import React, { useState } from "react";

const Register = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    cPassword: "",
    userType: 1, // Default to Student
  });

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your logic here to handle form submission (e.g., API call)
    console.log("Form submitted:", formData);
    // Reset form fields
    setFormData({
      userName: "",
      password: "",
      cPassword: "",
      userType: 1,
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
        <p className="text-center fw-bold mx-3 mb-0 text-muted">Register</p>
      </div>
      <div className="d-none alert alert-success" role="alert" id="registerAlert">
        User has successfully Registered.
      </div>
      <div className="d-none alert alert-danger" role="alert" id="registerExitAlert">
        User has Already Registered By Same Name and Type.
      </div>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="userName">UserName</label>
          <input
            type="text"
            id="userName"
            name="userName"
            className="form-control form-control-lg"
            value={formData.userName}
            onChange={handleChange}
            required
            minLength="6"
            autoComplete="off"
          />
          <div className="invalid-feedback">
            Please Enter User Name.
          </div>
        </div>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control form-control-lg"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <div className="invalid-feedback">
            Please Enter Password.
          </div>
        </div>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="cPassword">Confirm Password</label>
          <input
            type="password"
            id="cPassword"
            name="cPassword"
            className="form-control form-control-lg"
            value={formData.cPassword}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <div className="invalid-feedback">
            Please Enter Confirm Password.
          </div>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="userType"
            id="registerAdmin"
            value="0"
            checked={formData.userType === "0"}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="registerAdmin">Admin</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="userType"
            id="registerStudent"
            value="1"
            checked={formData.userType === "1"}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="registerStudent">Student</label>
        </div>
        <br /><br />
        {/* Submit button */}
        <button type="submit" name="btnRegister" id="btnRegister" className="btn btn-primary btn-lg btn-block">Register</button>
      </form>
    </div>
  );
};

export default Register;
