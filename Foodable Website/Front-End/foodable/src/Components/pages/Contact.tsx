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
        <div className="left-side">
          <div className="address details">
            <a href="#" className="icon-decoration">
              <i className="fas fa-map-marker-alt" />
              <div className="topic">Address</div>
            </a>
            <div className="text-one" />
            <div className="text-two" />
          </div>
          <div className="phone details">
            <a href="#" className="icon-decoration">
              <i className="fas fa-phone-alt" />
              <div className="topic">Phone</div>
            </a>
            <div className="text-one" />
            <div className="text-two" />
          </div>
          <div className="email details">
            <a href="#" className="icon-decoration">
              <i className="fas fa-envelope" />
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
             src="https://my.atlistmaps.com/map/8d0c2d8e-7923-4e2a-9ba3-f6cb51fcc204?share=true" allow="geolocation" width="100%" height="400px" frameborder="0" scrolling="no" allowfullscreen></iframe>
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
            <div className="topic-text">Send us a message</div>
            <p className="topic-text-p">
              Any queries about the Foodable Website
            </p>
            <form onSubmit={sendEmail}>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Your name"
                  required=""
                  name="name"
                />
              </div>
              <div className="input-box">
                <input
                  type="email"
                  placeholder="What's your email?"
                  required=""
                  name="email"
                />
              </div>
              <div className="input-box message-box">
                <textarea
                  required=""
                  placeholder="Your questions..."
                  defaultValue={""}
                  name="message"
                />
              </div>
              <div className="button">
                <input type="submit" defaultValue="Send a Message" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
