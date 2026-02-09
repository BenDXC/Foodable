import React from "react";
import "./cssFiles/Rewards.css";
import "./cssFiles/CreateDonation.css";
import RewardItem from "./RewardItem";
import { SetUserProps } from "../../types";
import UserSidebar from "../shared/UserSidebar";

interface RewardData {
  id: string;
  src: string;
  text: string;
  points: number;
}

export default function RewardPage(props: SetUserProps): JSX.Element {
  // TODO: Get username from context/props
  const username = "User"; // Replace with actual user data

  return (
    <div className="profilecontainer">
      <UserSidebar username={username} />
      <Rewards />
    </div>
  );
}

function Rewards(): JSX.Element {
  const userPoints = 150; // TODO: Get from user context

  const rewards: RewardData[] = [
    { id: '1', src: '../Img/sainsbury.jpeg', text: "100 Points Sainsbury's 10% off voucher", points: 100 },
    { id: '2', src: './Img/tesco-logo.jpeg', text: "100 Points Tesco 10% off voucher", points: 100 },
    { id: '3', src: './Img/ALDI_2017.png', text: "250 Points Aldi 25% off voucher", points: 250 },
    { id: '4', src: '../Img/sainsbury.jpeg', text: "50 Points Sainsbury's 5% off voucher", points: 50 },
    { id: '5', src: './Img/tesco-logo.jpeg', text: "200 Points Tesco 20% off voucher", points: 200 },
    { id: '6', src: '../Img/Morrisons-Logo.png', text: "200 Points Morrisons's 20% off voucher", points: 200 },
  ];

  return (
    <>
      {/* Main Content */}
      <div className="page_title">
        <h1 className="page_title">Foodable Rewards</h1>
      </div>
      <div className="page_description">
        <h3 className="page_description">
          {" "}
          At foodable we are all about encouraging others to help, so for each
          donation we provide you with points which you can exchange for various
          rewards{" "}
        </h3>
      </div>

      <div className="page_points">
        <h1 className="page_points">Your Points: {userPoints}</h1>
      </div>

      <div className="rewards">
        <div className="rewards__container">
          <h1 className="page_points">Rewards available to claim</h1>
          <div className="rewards__wrapper">
            <ul className="rewards__items">
              {rewards.slice(0, 2).map((reward) => (
                <RewardItem
                  key={reward.id}
                  src={reward.src}
                  text={reward.text}
                  path="/Reward"
                  label={`${reward.points} Points`}
                />
              ))}
            </ul>

            <ul className="rewards__items">
              {rewards.slice(2, 4).map((reward) => (
                <RewardItem
                  key={reward.id}
                  src={reward.src}
                  text={reward.text}
                  path="/Reward"
                  label={`${reward.points} Points`}
                />
              ))}
            </ul>

            <ul className="rewards__items">
              {rewards.slice(4, 6).map((reward) => (
                <RewardItem
                  key={reward.id}
                  src={reward.src}
                  text={reward.text}
                  path="/Reward"
                  label={`${reward.points} Points`}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* End Main Content */}
    </>
  );
}
