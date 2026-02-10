import React from "react";
import { FoodPackage } from "./FoodPackages";

interface SingleItemProps {
  product: FoodPackage;
}

export default function SingleItem({ product }: SingleItemProps): JSX.Element {
  return (
    <article 
      className="single"
      aria-label={`Food package ${product.packageID} - ${product.packageType}`}
    >
      <h2>
        {product.packageID} ({product.packageType})
      </h2>
      <h3 aria-label={`Location: ${product.packageLocation}`}>
        {product.packageLocation}
      </h3>
      <p>{product.packageDesc}</p>
      <p className="a">
        <a href="#contact" aria-label={`Contact foodbank about ${product.packageID}`}>
          Contact foodbank
        </a>
      </p>
    </article>
  );
}
