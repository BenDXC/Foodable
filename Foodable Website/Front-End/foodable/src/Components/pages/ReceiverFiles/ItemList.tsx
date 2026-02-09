import React from "react";
import { Button_Verify } from "../../MPComponents/Button";
import SingleItem from "./singleItem";

export default function ItemList(props) {
  return (
    <React.Fragment>
      <div className="instruction"> Please select a filter</div>
      <div className="btns">
        <button value="All" onClick={props.buttonhandler}>
          All
        </button>
        <button value="Halal" onClick={props.buttonhandler}>
          Halal
        </button>
        <button value="Vegan" onClick={props.buttonhandler}>
          Vegan
        </button>
        <button value="Vegetarian" onClick={props.buttonhandler}>
          Vegeterian
        </button>
      </div>

      <div>
        {props.products.map((product) => {
          return (
            <>
              <SingleItem key={product.packageID} product={product} />
              <Button_Verify onClick={Generate}>
                {" "}
                Get the OTP Code here{" "}
              </Button_Verify>
            </>
          );
        })}
      </div>
    </React.Fragment>
  );
}
function Generate() {
  let numbers = "1234567890";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += numbers[Math.floor(Math.random() * 10)];
  }
  document.getElementById("otp").innerHTML = OTP;
}
