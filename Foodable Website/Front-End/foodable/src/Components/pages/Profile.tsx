import React from "react";
import "./cssFiles/Profile.css";
import "./cssFiles/CreateDonation.css";
import { Link } from "react-router-dom";

export default function Donator_Navbar() {
  return (
    <div className="profilecontainer">
      <div className="mini-nav">
        <img
          className="profilephoto"
          src="Img/foodable1mini.jpg"
          alt="foodable"
        />
        <h1 className="username">Hasan Narmah</h1>
        <div className="sidebar">
          <div className="sidemenu">
            <div className="sidebutton">
              <ul>
                <li>
                  <Link to="/Donator">Donate</Link>
                </li>
                <li>
                  <Link to="/Reward">Rewards</Link>
                </li>
                <li>
                  <Link to="/Profile">Profile</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Profile />
      </div>
    </div>
  );
}

function Profile() {
  return (
    <>
      <div className="editprofile">
        <h1 className="mtitle">Edit Profile</h1>
        <br />
        <div className="row">
          {/* left column */}
          <div className="text-center">
            <img src="Img/foodable1mini.jpg" className="avatar" alt="avatar" />
            <h4 className="cpp">Change profile picture</h4>
            <input type="file" className="imagebtn" />
          </div>
        </div>
        {/* edit form column */}
        <h3 className="pititle">Personal info</h3>
        <form className="Profile-Form">
          <div className="form-group">
            <label className="fnlabel">First name:</label>
            <div className="col-lg-8">
              <input className="form-control" type="text" defaultValue="John" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-lg-3 control-label">Last name:</label>
            <div className="col-lg-8">
              <input className="form-control" type="text" defaultValue="Doe" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-lg-3 control-label">Postcode:</label>
            <div className="col-lg-8">
              <input
                className="form-control"
                type="text"
                defaultValue="SL6 1TJ"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-lg-3 control-label">Email:</label>
            <div className="col-lg-8">
              <input
                className="form-control"
                type="text"
                defaultValue="johndoe@gmail.com"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-lg-8"></div>
          </div>
          <button type="submit" className="sub-btn">
            Confirm changes
          </button>
        </form>
      </div>
    </>
  );
}
