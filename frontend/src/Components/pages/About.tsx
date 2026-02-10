import React from "react";
import Cards from "../MPComponents/Cards";
import { Button_Foodbank, Button_Receiver } from "../MPComponents/Button";

export default function About(): JSX.Element {
  return (
    <>
      {/* Main Content */}
      <div className="main_content">
        <h3>
          At Foodable our focus is to tackle world hunger with healthy food
          packages that meet peoples different dietary requirements.
        </h3>
        <br />
        <h3>
          Foodable allows for people to use a single platform for creating
          packages for a preferred dietary needs and for people that need them a
          place to find them!
        </h3>
        <br />
        <h3>Global Hunger is not the only thing we are after!</h3>
        <h4>
          {" "}
          Waste is another issue that has been increasing around the world
          <br /> to allow people to donate items that might get tossed away to
          someone that may need it.
        </h4>
        <br />
      </div>
      {/* Foodbank Locations */}
      <div className="main_content">
        <Button_Foodbank className="btn-mobile-Donator" value="Donate Food">
          {" "}
          Find Foodbanks here
        </Button_Foodbank>
      </div>
      <Cards />

      {/* End Main Content */}
    </>
  );
}
