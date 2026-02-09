import React from "react";
// import Profile from "./Profile";
import "./cssFiles/Donator.css";
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
        <CreateDonation />
        {/* <Profile /> */}
      </div>
    </div>
  );
}
function CreateDonation() {
  return (
    <div className="profilecontainer">
      <div className="cdbackground">
        <div className="itemform">
          <h1 className="titleil">Create Donation</h1>
          <form className="create-form" action="">
            <h2 className="itemname">Item name</h2>
            <input
              type="text"
              name="Item Name"
              id="txt"
              className="nameinput"
              required="P"
            />
            <h2 className="itemquantity">Item quantity</h2>
            <input
              type="number"
              name="Item Quantity"
              id="number"
              className="itemq"
              min={1}
              max={100}
              required="P"
            />
            <h2 className="dtitle">Select dietary preference</h2>
            <input
              type="radio"
              name="Dietary Preference"
              id="dPref"
              required="P"
            />
            <label htmlFor="Dietary"> Halal</label>
            <br />
            <input
              type="radio"
              name="Dietary Preference"
              id="dPref"
              required="P"
            />
            <label htmlFor="Dietary"> Non-Halal</label>
            <br />
            <input
              type="radio"
              name="Dietary Preference"
              id="dPref"
              required="P"
            />
            <label htmlFor="Dietary"> Vegan</label>
            <br />
            <input
              type="radio"
              name="Dietary Preference"
              id="dPref"
              required="P"
            />
            <label htmlFor="Dietary"> Vegetarian</label>
            <br />
            <h2 className="extitle">Expiry date</h2>
            <input type="date" name="bbd" id="Expiry" required="A" />
            <h2 className="imagetitle">Upload image</h2>
            <input
              type="file"
              id="FoodImage"
              name="filename"
              accept="image/*"
            />
            <br />
            <button type="submit" className="sub-btn">
              Add item
            </button>
          </form>
          <h2 className="ptitle">Item added to package</h2>
          <div className="itemlist">
            <ul className="ilist">
              <li>
                <span>x</span>
              </li>
              <li>
                <span>x</span>
              </li>
              <li>
                <span>x</span>
              </li>
            </ul>
            <button type="submit" className="cp-btn">
              Create package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
