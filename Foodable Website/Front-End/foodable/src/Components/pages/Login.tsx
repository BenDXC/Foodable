import React, { useState, ChangeEvent, FormEvent } from "react";
import toast from 'react-hot-toast';
import "./cssFiles/Login.css";
import { Button_Register } from "../MPComponents/Button";
import { SetUserProps } from "../../types";
import { AuthService, ApiError } from "../../services/api.service";
import { VALIDATION, ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants";
import logger from "../../utils/logger";

interface LoginInputs {
  email?: string;
  password?: string;
}

interface LoginResponse {
  token?: string;
  message?: string;
}

export default function Login(props: SetUserProps): JSX.Element {
  const [inputs, setInput] = useState<LoginInputs>({});
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setInput((values) => ({ ...values, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!inputs.email || !inputs.password) {
      const error = ERROR_MESSAGES.REQUIRED_FIELDS;
      setOutput(error);
      toast.error(error);
      return false;
    }
    
    if (!VALIDATION.EMAIL_REGEX.test(inputs.email)) {
      const error = ERROR_MESSAGES.INVALID_EMAIL;
      setOutput(error);
      toast.error(error);
      return false;
    }
    
    if (inputs.password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      const error = ERROR_MESSAGES.PASSWORD_TOO_SHORT;
      setOutput(error);
      toast.error(error);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const { token } = await AuthService.login({
        email: inputs.email || "",
        password: inputs.password || "",
      });

      sessionStorage.setItem("jwt", token);
      props.setLoggedinUser(inputs.email || "");
      
      setOutput(SUCCESS_MESSAGES.LOGIN_SUCCESS);
      toast.success(SUCCESS_MESSAGES.LOGIN_SUCCESS);
      logger.debug('Login successful for:', inputs.email);
    } catch (err) {
      const error = err as ApiError;
      const errorMsg = error.message || ERROR_MESSAGES.LOGIN_FAILURE;
      
      setOutput(errorMsg);
      toast.error(errorMsg);
      props.setLoggedinUser("");
      logger.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="user">
        <header className="page_header_logo">
          <h1 className="page_title">Sign In</h1>
        </header>
        <form className="Login-form" onSubmit={handleSubmit} noValidate>
          <div className="sign-in-form">
            <input
              className="form__input"
              type="email"
              name="email"
              placeholder="Enter your Email"
              value={inputs.email || ""}
              onChange={handleChange}
            />
          </div>
          <div className="sign-in-form">
            <input
              className="form__input"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={inputs.password || ""}
              onChange={handleChange}
            />
          </div>
          <div className="buttonbg">
            <input 
              className="signinbutton" 
              type="submit" 
              disabled={loading}
              value={loading ? "Signing in..." : "Sign In"}
            />
          </div>
          <p className="sign-upmessage">Don't have an account? Sign Up!</p>
          <div className="signupbut">
            <Button_Register className="btn-mobile" value="Donate Food">
              {" "}
              Sign Up
            </Button_Register>
          </div>
        </form>
        <div className="center">
          <p>{output}</p>
        </div>
      </div>
    </>
  );
}
