import React from "react";
import "./Button.css";
import { Link } from "react-router-dom";
import { ButtonProps } from "../../types";

const STYLES: string[] = ["btn--primary", "btn--outline", "btn--test"];
const SIZES: string[] = ["btn--medium", "btn--large"];

export const Button: React.FC<ButtonProps> = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
}): JSX.Element => {
  const checkButtonStyle = buttonStyle && STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = buttonSize && SIZES.includes(buttonSize) 
    ? buttonSize 
    : SIZES[0];

  return (
    <>
      <Link to="/Login" className="btn-mobile">
        <button
          className={`btn ${checkButtonStyle} ${checkButtonSize}`}
          onClick={onClick}
          type={type}
        >
          {children}
        </button>
      </Link>
    </>
  );
};

export const Button_D: React.FC<ButtonProps> = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
}): JSX.Element => {
  const checkButtonStyle = buttonStyle && STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = buttonSize && SIZES.includes(buttonSize) 
    ? buttonSize 
    : SIZES[0];

  return (
    <>
      <Link to="/Donator" className="btn-mobile">
        <button
          className={`btn ${checkButtonStyle} ${checkButtonSize}`}
          onClick={onClick}
          type={type}
        >
          {children}
        </button>
      </Link>
    </>
  );
};

export const Button_Receiver: React.FC<ButtonProps> = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
}): JSX.Element => {
  const checkButtonStyle = buttonStyle && STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = buttonSize && SIZES.includes(buttonSize) 
    ? buttonSize 
    : SIZES[0];

  return (
    <>
      <Link to="/Receiver" className="btn-mobile">
        <button
          className={`btn ${checkButtonStyle} ${checkButtonSize}`}
          onClick={onClick}
          type={type}
        >
          {children}
        </button>
      </Link>
    </>
  );
};

export const Button_Register: React.FC<ButtonProps> = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
}): JSX.Element => {
  const checkButtonStyle = buttonStyle && STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = buttonSize && SIZES.includes(buttonSize) 
    ? buttonSize 
    : SIZES[0];

  return (
    <>
      <Link to="/Registration" className="btn-mobile">
        <button
          className={`btn ${checkButtonStyle} ${checkButtonSize}`}
          onClick={onClick}
          type={type}
        >
          {children}
        </button>
      </Link>
    </>
  );
};

export const Button_Foodbank: React.FC<ButtonProps> = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
}): JSX.Element => {
  const checkButtonStyle = buttonStyle && STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = buttonSize && SIZES.includes(buttonSize) 
    ? buttonSize 
    : SIZES[0];

  return (
    <>
      <Link to="/Foodbank" className="btn-mobile">
        <button
          className={`btn ${checkButtonStyle} ${checkButtonSize}`}
          onClick={onClick}
          type={type}
        >
          {children}
        </button>
      </Link>
    </>
  );
};

export const Button_Verify: React.FC<ButtonProps> = ({ 
  children, 
  type, 
  buttonStyle, 
  buttonSize 
}): JSX.Element => {
  const checkButtonStyle = buttonStyle && STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];

  const checkButtonSize = buttonSize && SIZES.includes(buttonSize) 
    ? buttonSize 
    : SIZES[0];

  return (
    <>
      <button
        className={`btn ${checkButtonStyle} ${checkButtonSize}`}
        onClick={Generate}
        type={type}
      >
        {children}
      </button>
    </>
  );
};

function Generate(): void {
  const numbers = "1234567890";
  let OTP = "";
  for (let i = 0; i < 8; i++) {
    OTP += numbers[Math.floor(Math.random() * 10)];
  }
  alert(OTP);
}
