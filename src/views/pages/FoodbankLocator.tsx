import React, { useEffect, useState } from 'react';

import { FoodBank } from '../types/index';

export const FoodBankLocator: React.FC = () => {
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([]);

  const fetchFoodBanks = async () => {
    try {
      const res = await fetch('/api/foodbanks');
      const data = await res.json();
      setFoodBanks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFoodBanks();
  }, []);

  return (
    <div>
      <h1>Food Bank Locator</h1>
      <ul>
        {foodBanks.map((bank) => (
          <li key={bank._id}>
            {bank.name} - {bank.address} - {bank.contactEmail}
          </li>
        ))}
      </ul>
    </div>
  );
};
