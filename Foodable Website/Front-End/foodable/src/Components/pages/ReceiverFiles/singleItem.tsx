import React from "react";
import { FoodPackage } from "./FoodPackages";

interface SingleItemProps {
  product: FoodPackage;
}

export default function SingleItem({ product }: SingleItemProps): JSX.Element {
  return (
    <div className="single">
      <h2>
        {product.packageID} ({product.packageType})
      </h2>
      <h3>{product.packageLocation}</h3>
      <p>{product.packageDesc}</p>
      <p className="a">Contact foodbank</p>
    </div>
  );
}
