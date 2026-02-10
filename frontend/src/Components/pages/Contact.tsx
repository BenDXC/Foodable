import emailjs from "@emailjs/browser";
import React, { FormEvent } from "react";
import "./cssFiles/Contact.css";

export default function ContactUs(): JSX.Element {
  const sendEmail = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const result = await emailjs.sendForm(
        "gmail",
        "Automated_Email",
        e.currentTarget,
        "user_mlsqPrWKZea6YAr2udP9X"
      );
      console.log(result.text);
    } catch (error: any) {
      console.log(error.text);
    }
    
    if (e.currentTarget) {
      e.currentTarget.reset();
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="left-side" role="complementary" aria-label="Contact information">
          <div className="address details">
            <a href="#" className="icon-decoration" aria-label="Our address">
              <i className="fas fa-map-marker-alt" aria-hidden="true" />
              <div className="topic">Address</div>
            </a>
            <div className="text-one" />
            <div className="text-two" />
          </div>
          <div className="phone details">
            <a href="#" className="icon-decoration" aria-label="Our phone number">
              <i className="fas fa-phone-alt" aria-hidden="true" />
              <div className="topic">Phone</div>
            </a>
            <div className="text-one" />
            <div className="text-two" />
          </div>
          <div className="email details">
            <a href="#" className="icon-decoration" aria-label="Our email address">
              <i className="fas fa-envelope" aria-hidden="true" />
              <div className="topic">Email</div>
            </a>
            <div className="text-one" />
            <div className="text-two" />
          </div>
        </div>
        <div className="right-side">
          <div id="google-map" className="contact-container-address">
            <h3 className="contact-container-address-title">Our Location</h3>
            <iframe
              src="https://my.atlistmaps.com/map/8d0c2d8e-7923-4e2a-9ba3-f6cb51fcc204?share=true" 
              allow="geolocation" 
              width="100%" 
              height="400px" 
              frameBorder="0" 
              scrolling="no" 
              allowFullScreen
              title="Foodable location map"
              aria-label="Interactive map showing Foodable office locations"
            />
          </div>
          <br></br>
          <div id="number-details" className="contact-container-number">
            <h2 className="contact-container-number-title">Get in touch</h2>
            <article className="contact-container-number-subtitle">
              <p className="contact-container-number-subtitle-text">
                You can call us at
              </p>
              <p className="contact-container-number-subtitle-digit">
                +44 7911 123456
              </p>
            </article>
            <p className="contact-container-number-content">
              If you have any questions, do not hesitate and call us at the
              phone number shown above, or you can email us at
              "foodable7@gmail.com". Our team will be more than happy to provide
              you with the help you need.
            </p>
          </div>
          <br></br>
          <div id="message-form" className="contact-container-send-message">
            <div className="topic-text" id="contact-form-heading">Send us a message</div>
            <p className="topic-text-p">
              Any queries about the Foodable Website
            </p>
            <form 
              onSubmit={sendEmail}
              aria-labelledby="contact-form-heading"
            >
              <div className="input-box">
                <label htmlFor="contact-name" className="sr-only">Your name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your name"
                  required
                  name="name"
                  aria-required="true"
                  aria-label="Enter your name"
                />
              </div>
              <div className="input-box">
                <label htmlFor="contact-email" className="sr-only">Your email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="What's your email?"
                  required
                  name="email"
                  aria-required="true"
                  aria-label="Enter your email address"
                />
              </div>
              <div className="input-box message-box">
                <label htmlFor="contact-message" className="sr-only">Your message</label>
                <textarea
                  id="contact-message"
                  required
                  placeholder="Your questions..."
                  defaultValue={""}
                  name="message"
                  aria-required="true"
                  aria-label="Enter your message or question"
                />
              </div>
              <div className="button">
                <input 
                  type="submit" 
                  defaultValue="Send a Message"
                  aria-label="Send message to Foodable"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
