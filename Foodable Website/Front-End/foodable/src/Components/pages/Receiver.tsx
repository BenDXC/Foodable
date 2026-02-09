import React, { useState, useCallback } from "react";
import { foodpackages, FoodPackage } from "./ReceiverFiles/FoodPackages";
import ItemList from "./ReceiverFiles/ItemList";
import "./ReceiverFiles/Receiver.css";
import logger from "../../utils/logger";

export default function ReceiverPage(): JSX.Element {
  const [products] = useState<FoodPackage[]>(foodpackages);
  const [filteredProducts, setFilteredProducts] = useState<FoodPackage[]>([]);

  const buttonhandler = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    const value = (e.target as HTMLButtonElement).value;
    logger.debug('Filter clicked:', value);
    
    let filtered: FoodPackage[];
    if (value === "All") {
      filtered = products;
    } else {
      filtered = products.filter(
        (item) => item.packageType === value
      );
    }

    setFilteredProducts(filtered);
  }, [products]);

  return (
    <div>
      <div className="pageResults">
        <ItemList
          products={filteredProducts}
          buttonhandler={buttonhandler}
        />
      </div>
    </div>
  );
}
