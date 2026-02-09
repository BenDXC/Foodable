import React, { useState, ChangeEvent, FormEvent } from "react";
import "./cssFiles/Login.css";
import { Button_Register } from "../MPComponents/Button";
import axios, { AxiosError, AxiosResponse } from "axios";
import { SetUserProps, LoginData } from "../../types";

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setInput((values) => ({ ...values, [name]: value }));
  };

  const validateForm = (): boolean => {
    const mailformat = /\S+@\S+\.\S+/;
    let valid = false;
    if (!inputs.email || !inputs.password) {
      setOutput("Validation failure: Please fill in all text fields.");
    } else if (!mailformat.test(inputs.email)) {
      setOutput(
        "Validation failure: Invalid e-mail address. Please enter your e-mail again."
      );
    } else if (inputs.password.length < 8) {
      setOutput(
        "Validation failure: Password is too short. Please enter your password"
      );
    } else {
      valid = true;
    }
    return valid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const dataLogin: LoginData = { 
      email: inputs.email || "", 
      password: inputs.password || "" 
    };

    console.log(dataLogin);

    if (validateForm()) {
      try {
        const response: AxiosResponse<LoginResponse> = await axios({
          method: "post",
          url: "http://localhost:8080/signin",
          data: dataLogin,
        });

        console.log(response);
        if (response.status === 200) {
          setOutput("Login success");
          const jwtToken = response.headers.authorization?.split(" ")[1];
          if (jwtToken) {
            sessionStorage.setItem("jwt", jwtToken);
            console.log(jwtToken);
            props.setLoggedinUser(inputs.email || "");
          } else {
            setOutput("Token failure");
            props.setLoggedinUser("");
          }
        } else {
          setOutput("Login failure");
          props.setLoggedinUser("");
        }
      } catch (err) {
        const error = err as AxiosError;
        console.log(error.response);
        setOutput("Login failure");
        props.setLoggedinUser("");
      }
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
            <input className="signinbutton" type="submit" />
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
