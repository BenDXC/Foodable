import React, { useState, ChangeEvent, FormEvent } from "react";
import toast from 'react-hot-toast';
import { Button } from "../MPComponents/Button";
import "./cssFiles/Register.css";
import { VALIDATION, ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants";
import { AuthService, ApiError } from "../../services/api.service";
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
    
    const showError = (error: string): void => {
      setOutput(error);
      toast.error(error);
    };
    
    if (!inputs.username || !inputs.email || !inputs.password || !inputs.repPassword) {
      showError(ERROR_MESSAGES.REQUIRED_FIELDS);
      return false;
    }
    
    if (inputs.username.length > VALIDATION.MAX_USERNAME_LENGTH) {
      showError(ERROR_MESSAGES.USERNAME_TOO_LONG);
      return false;
    }
    
    if (!VALIDATION.EMAIL_REGEX.test(inputs.email)) {
      showError(ERROR_MESSAGES.INVALID_EMAIL);
      return false;
    }
    
    if (inputs.password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      showError(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
      return false;
    }
    
    if (inputs.password !== inputs.repPassword) {
      showError(ERROR_MESSAGES.PASSWORDS_MISMATCH);
      return false;
    }
    
    if (!inputs.tos) {
      showError(ERROR_MESSAGES.TOS_NOT_ACCEPTED);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!validateForm()) return;

    const dataRegistration: RegistrationData = {
      username: inputs.username || "",
      email: inputs.email || "",
      password: inputs.password || "",
    };

    setLoading(true);
    
    try {
      const result = await AuthService.register(dataRegistration);
      
      setOutput(result.message);
      toast.success(result.message);
      logger.debug('Registration successful:', dataRegistration.username);
      
      // Clear form on success
      setInput({});
    } catch (err) {
      const error = err as ApiError;
      const errorMsg = error.message || ERROR_MESSAGES.REGISTRATION_FAILURE;
      
      setOutput(errorMsg);
      toast.error(errorMsg);
      logger.error('Registration failed', error);
    } finally {
      setLoading(false);
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
