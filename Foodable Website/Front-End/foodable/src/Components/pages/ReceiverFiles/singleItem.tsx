import React from "react";

export default function singleItem(props) {
  return (
    <div className="single">
      <h2>
        {" "}
        {props.product.packageID} ({props.product.packageType}){" "}
      </h2>
      <h3> {props.product.packageLocation} </h3>

      <p> {props.product.packageDesc}</p>

      <p className="a"> Contact foodbank</p>
    </div>
  );
}
