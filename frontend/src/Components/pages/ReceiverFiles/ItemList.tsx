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
      <div className="instruction" role="status">Please select a filter</div>
      <div className="btns" role="group" aria-label="Food package filters">
        <button 
          value="All" 
          onClick={buttonhandler}
          aria-label="Show all food packages"
        >
          All
        </button>
        <button 
          value="Halal" 
          onClick={buttonhandler}
          aria-label="Filter for halal food packages"
        >
          Halal
        </button>
        <button 
          value="Vegan" 
          onClick={buttonhandler}
          aria-label="Filter for vegan food packages"
        >
          Vegan
        </button>
        <button 
          value="Vegetarian" 
          onClick={buttonhandler}
          aria-label="Filter for vegetarian food packages"
        >
          Vegetarian
        </button>
      </div>

      <div role="region" aria-label="Available food packages">
        {products.length === 0 ? (
          <p role="status">No packages match your filter. Please select a different filter.</p>
        ) : (
          products.map((product) => (
            <div key={product.packageID}>
              <SingleItem product={product} />
              <Button_Verify onClick={generateOTP}>
                Get the OTP Code here
              </Button_Verify>
            </div>
          ))
        )}
      </div>
    </React.Fragment>
  );
}
