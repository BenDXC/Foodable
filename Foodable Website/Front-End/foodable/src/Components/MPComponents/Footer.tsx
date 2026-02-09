import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer: React.FC = (): JSX.Element => {
  return (
    <footer className="footer-container" role="contentinfo" aria-label="Site footer">
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>About Us</h2>
            <Link to="/About" aria-label="About Foodable">About Us</Link>
            <Link to="/About" aria-label="How Foodable works">How it works</Link>
            <Link to="/About" aria-label="Terms of service">Terms of Service</Link>
          </div>
          <div className="footer-link-items">
            <h2>Contact Us</h2>
            <Link to="/Contact" aria-label="Contact Foodable">Contact</Link>
            <Link to="/Contact" aria-label="Get support">Support</Link>
            <Link to="/Contact" aria-label="Send us a message">Send A Message</Link>
            <Link to="/Contact" aria-label="View offline maps">Offline Maps</Link>
          </div>
        </div>
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>Online Services</h2>
            <Link to="/Donator" aria-label="Donate food to foodbanks">Donate Food</Link>
            <Link to="/Donator" aria-label="Learn what you can donate">What you can donate</Link>
            <Link to="/Receiver" aria-label="Receive food packages">Receive Food</Link>
          </div>
          <div className="footer-link-items">
            <h2>Donator Rewards</h2>
            <Link to="/Reward" aria-label="Find available rewards">Find Rewards</Link>
            <Link to="/Reward" aria-label="Get rewards for donating">Get Rewards</Link>
            <Link to="/Reward" aria-label="Claim your rewards">Claim Rewards</Link>
          </div>
        </div>
      </div>
      <section className="social-media" aria-label="Social media links">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link to="/" className="social-logo" aria-label="Foodable home page">
              <img src="Img/foodablemain.jpg" alt="Foodable Logo" />
            </Link>
          </div>
          <p className="website-rights" role="contentinfo">
            Foodable &copy;{new Date().getFullYear()} | All Rights Reserved{" "}
          </p>
          <div className="social-icons" role="navigation" aria-label="Social media navigation">
            <Link 
              className="social-icon-link facebook" 
              to="" 
              aria-label="Visit our Facebook page"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f" aria-hidden="true" />
            </Link>
            <Link
              className="social-icon-link instagram"
              to=""
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram page"
            >
              <i className="fab fa-instagram" aria-hidden="true" />
            </Link>
            <Link
              className="social-icon-link youtube"
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our YouTube channel"
            >
              <i className="fab fa-youtube" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
