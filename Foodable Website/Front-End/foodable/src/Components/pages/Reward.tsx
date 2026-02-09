import React from "react";
import "./cssFiles/Rewards.css";
import "./cssFiles/CreateDonation.css";
import RewardItem from "./RewardItem";
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
        <Rewards />
      </div>
    </div>
  );
}

function Rewards() {
  return (
    <>
      {/* Main Content */}
      <div class="page_title">
        <h1 class="page_title">Foodable Rewards</h1>
      </div>
      <div class="page_description">
        <h3 class="page_description">
          {" "}
          At foodable we are all about encouraging others to help, so for each
          donation we provide you with points which you can exchange for various
          rewards{" "}
        </h3>
      </div>

      <div class="page_points">
        <h1 class="page_points">Your Points:</h1>
      </div>

      <div className="rewards">
        <div className="rewards__container">
          <h1 className="page_points">Rewards available to claim</h1>
          <div className="rewards__wrapper">
            <ul className="rewards__items">
              <RewardItem
                src="../Img/sainsbury.jpeg"
                text="100 Points Sainsbury's 10% off voucher"
                path="/Reward"
              />
              <RewardItem
                src="./Img/tesco-logo.jpeg"
                text="100 Points Tesco 10% off voucher"
                path="/Reward"
              />
            </ul>

            <ul className="rewards__items">
              <RewardItem
                src="./Img/ALDI_2017.png"
                text="250 Points Aldi 25% off voucher"
                path="/Reward"
              />
              <RewardItem
                src="../Img/sainsbury.jpeg"
                text="50 Points Sainsbury's 5% off voucher"
                path="/Reward"
              />
            </ul>

            <ul className="rewards__items">
              <RewardItem
                src="./Img/tesco-logo.jpeg"
                text="200 Points Tesco 20% off voucher"
                path="/Reward"
              />
              <RewardItem
                src="../Img/Morrisons-Logo.png"
                text="200 Points Morrisons's 20% off voucher"
                path="/Reward"
              />
            </ul>
          </div>
        </div>
      </div>

      {/* End Main Content */}
    </>
  );
}
