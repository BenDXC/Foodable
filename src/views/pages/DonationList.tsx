import React from 'react';

import { Donation } from '../types/index';

interface Props {
  donations: Donation[];
}

export const DonationList: React.FC<Props> = ({ donations }) => (
  <ul>
    {donations.map((d) => (
      <li key={d._id}>
        {d.foodItem} - {d.quantity} - {new Date(d.expiryDate).toLocaleDateString()}
      </li>
    ))}
  </ul>
);
