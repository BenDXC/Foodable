import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer: React.FC = (): JSX.Element => {
  return (
    <div className="footer-container">
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>About Us</h2>
            <Link to="/About">About Us</Link>
            <Link to="/About">How it works</Link>
            <Link to="/About">Terms of Service</Link>
          </div>
          <div className="footer-link-items">
            <h2>Contact Us</h2>
            <Link to="/Contact">Contact</Link>
            <Link to="/Contact">Support</Link>
            <Link to="/Contact">Send A Message</Link>
            <Link to="/Contact">Offline Maps</Link>
          </div>
        </div>
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Online Services</h2>
            <Link to="/Donator">Donate Food</Link>
            <Link to="/Donator">What you can donate</Link>
            <Link to="/Receiver">Receive Food</Link>
          </div>
          <div className="footer-link-items">
            <h2>Donator Rewards</h2>
            <Link to="/Reward">Find Rewards</Link>
            <Link to="/Reward">Get Rewards</Link>
            <Link to="/Reward">Claim Rewards</Link>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link to="/" className="social-logo">
              <img src="Img/foodablemain.jpg" alt="Foodable Logo" />
            </Link>
          </div>
          <p className="website-rights">
            Foodable &copy;{new Date().getFullYear()} | All Rights Reserved{" "}
          </p>
          <div className="social-icons">
            <Link className="social-icon-link facebook" to="" aria-label="Facebook">
              <i className="fab fa-facebook-f" />
            </Link>
            <Link
              className="social-icon-link instagram"
              to=""
              target="_blank"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" />
            </Link>
            <Link
              className="social-icon-link youtube"
              to="/"
              target="_blank"
              aria-label="Youtube"
            >
              <i className="fab fa-youtube" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
