import React, { useState } from "react";
import axios from "axios";
import { Button } from "../MPComponents/Button";
import "./cssFiles/Register.css";

function Registration() {
  const [inputs, setInput] = useState({});
  const [output, setOutput] = useState("");

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setInput((values) => ({ ...values, [name]: value }));
  };

  const validateForm = () => {
    console.log(inputs);
    var mailformat = /\S+@\S+\.\S+/;
    var valid = false;
    if (
      !inputs.username ||
      !inputs.email ||
      !inputs.password ||
      !inputs.repPassword
    ) {
      setOutput("Validation failure: Please fill in all text fields.");
    } else if (inputs.username.length > 50) {
      setOutput(
        "Validation  failure: Username cannot be longer than 50 characters"
      );
    } else if (!mailformat.test(inputs.email)) {
      setOutput(
        "Validation failure: Invalid e-mail address. Please enter your e-mail again."
      );
    } else if (inputs.password.length < 8) {
      setOutput(
        "Validation failure: Password is too short. Please select another password"
      );
    } else if (inputs.password !== inputs.repPassword) {
      setOutput("Validation failure: Passwords do not match. Please retry");
    } else if (!inputs.tos) {
      setOutput(
        "Validation failure: Please agree to the Terms and Conditions, and Privacy Policy."
      );
    } else {
      valid = true;
    }
    return valid;
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const dataRegistration = (({ username, email, password }) => ({
      username,
      email,
      password,
    }))(inputs);

    if (validateForm()) {
      axios({
        method: "POST",
        url: "http://localhost:8080/signup",
        data: dataRegistration,
      })
        .then((response) => {
          console.log(response);
          setOutput(
            response.status === 201
              ? `Registration success: ${dataRegistration["username"]}`
              : "Registration failure"
          );
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <React.Fragment>
      <div className="user">
        <header className="page_header_logo">
          <h1 className="page_title">Sign up</h1>
        </header>
      </div>
      <form className="Registration-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="textInput">
            Username:
            <input
              name="username"
              value={inputs.username || ""}
              onChange={handleChange}
              placeholder="Enter your name"
              className="form__input"
              required=""
            />
          </label>
        </div>
        <div className="form-group">
          <label className="textInput">
            Email:
            <input
              type="email"
              name="email"
              value={inputs.email || ""}
              onChange={handleChange}
              placeholder="Enter Email"
              className="form__input"
              required=""
            />
          </label>
        </div>
        <div className="form-group">
          <label className="textInput">
            Password:
            <input
              type="password"
              name="password"
              id="create_pw"
              placeholder="Password"
              className="form__input"
              required=""
              minLength={8}
              value={inputs.password || ""}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label className="textInput">
            Re-type password:
            <input
              type="password"
              name="repPassword"
              value={inputs.repPassword || ""}
              onChange={handleChange}
              id="create_pw"
              placeholder=" Enter your Password again"
              className="form__input"
              required=""
            />
          </label>
        </div>
        <div className="tosbox">
          <label>
            <input
              type="checkbox"
              name="tos"
              checked={inputs.isTos}
              onChange={handleChange}
              required
            />
            I agree to the Terms of Use and the Privacy Policy.
          </label>
        </div>
        <div className="buttonbg">
          <input className="regbut" type="submit" />
        </div>
        <p className="sign-inmessage">Or if you have an account</p>
        <div className="signinbut">
          <Button className="btn-mobile"> Sign in</Button>
        </div>
      </form>
      <div className="center">
        <p>{output}</p>
      </div>
    </React.Fragment>
  );
}

export default Registration;
