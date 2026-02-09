import React, { Component } from "react";
import { foodpackages } from "./ReceiverFiles/FoodPackages";
import ItemList from "./ReceiverFiles/ItemList";
import "./ReceiverFiles/Receiver.css";

export default class extends Component {
  state = {
    products: foodpackages,
    filteredProducts: [],
  };

  //buttons functionality

  buttonhandler = (e) => {
    console.log(e.target.value);
    let filteredProducts;
    if (e.target.value === "All") {
      filteredProducts = this.state.products;
    } else {
      filteredProducts = this.state.products.filter(
        (item) => item.packageType === e.target.value
      );
    }

    this.setState({
      filteredProducts: filteredProducts,
    });
  };

  render() {
    return (
      <div>
        <div className="pageResults">
          <ItemList
            products={this.state.filteredProducts}
            buttonhandler={this.buttonhandler}
          />
        </div>
      </div>
    );
  }
}
