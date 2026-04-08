import React, { useEffect, useState } from 'react';

import { Donation } from '../types/index';
import { DonationList } from '../pages/DonationList';

export const Dashboard: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);

  const fetchDonations = async () => {
    try {
      const res = await fetch('/api/donations');
      const data = await res.json();
      setDonations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div>
      <h1>Available Donations</h1>
      <DonationList donations={donations} />
    </div>
  );
};
