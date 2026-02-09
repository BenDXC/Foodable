import React from "react";
import { Button_Verify } from "../../MPComponents/Button";
import SingleItem from "./singleItem";
import { FoodPackage } from "./FoodPackages";

interface ItemListProps {
  products: FoodPackage[];
  buttonhandler: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ItemList({ products, buttonhandler }: ItemListProps): JSX.Element {
  const generateOTP = (): void => {
    const numbers = "1234567890";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += numbers[Math.floor(Math.random() * 10)];
    }
    const otpElement = document.getElementById("otp");
    if (otpElement) {
      otpElement.innerHTML = OTP;
    }
  };

  return (
    <React.Fragment>
      <div className="instruction"> Please select a filter</div>
      <div className="btns">
        <button value="All" onClick={buttonhandler}>
          All
        </button>
        <button value="Halal" onClick={buttonhandler}>
          Halal
        </button>
        <button value="Vegan" onClick={buttonhandler}>
          Vegan
        </button>
        <button value="Vegetarian" onClick={buttonhandler}>
          Vegetarian
        </button>
      </div>

      <div>
        {products.map((product) => (
          <div key={product.packageID}>
            <SingleItem product={product} />
            <Button_Verify onClick={generateOTP}>
              Get the OTP Code here
            </Button_Verify>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
