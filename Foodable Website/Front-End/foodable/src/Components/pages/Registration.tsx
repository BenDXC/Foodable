import React, { useState, ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "../MPComponents/Button";
import "./cssFiles/Register.css";
import { VALIDATION, ERROR_MESSAGES } from "../../constants";
import logger from "../../utils/logger";

interface RegistrationInputs {
  username?: string;
  email?: string;
  password?: string;
  repPassword?: string;
  tos?: boolean;
}

interface RegistrationData {
  username: string;
  email: string;
  password: string;
}

function Registration(): JSX.Element {
  const [inputs, setInput] = useState<RegistrationInputs>({});
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setInput((values) => ({ ...values, [name]: value }));
  };

  const validateForm = (): boolean => {
    logger.debug('Validating registration form', inputs);
    
    let valid = false;
    if (
      !inputs.username ||
      !inputs.email ||
      !inputs.password ||
      !inputs.repPassword
    ) {
      setOutput(ERROR_MESSAGES.REQUIRED_FIELDS);
    } else if (inputs.username.length > VALIDATION.MAX_USERNAME_LENGTH) {
      setOutput(ERROR_MESSAGES.USERNAME_TOO_LONG);
    } else if (!VALIDATION.EMAIL_REGEX.test(inputs.email)) {
      setOutput(ERROR_MESSAGES.INVALID_EMAIL);
    } else if (inputs.password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      setOutput(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
    } else if (inputs.password !== inputs.repPassword) {
      setOutput(ERROR_MESSAGES.PASSWORDS_MISMATCH);
    } else if (!inputs.tos) {
      setOutput(ERROR_MESSAGES.TOS_NOT_ACCEPTED);
    } else {
      valid = true;
    }
    return valid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const dataRegistration: RegistrationData = {
      username: inputs.username || "",
      email: inputs.email || "",
      password: inputs.password || "",
    };

    if (validateForm()) {
      setLoading(true);
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
        const response = await axios.post(
          `${apiBaseUrl}/signup`,
          dataRegistration
        );
        
        logger.debug('Registration response', response);
        setOutput(
          response.status === 201
            ? `Registration success: ${dataRegistration.username}`
            : ERROR_MESSAGES.REGISTRATION_FAILURE
        );
      } catch (err) {
        const error = err as AxiosError;
        logger.error('Registration failed', error);
        setOutput(ERROR_MESSAGES.REGISTRATION_FAILURE);
      } finally {
        setLoading(false);
      }
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
          <input 
            className="regbut" 
            type="submit" 
            disabled={loading}
            value={loading ? "Registering..." : "Register"}
          />
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
