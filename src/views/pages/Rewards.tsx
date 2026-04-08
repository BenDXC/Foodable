import React, { useEffect, useState } from 'react';

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
}

export const Rewards: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);

  const fetchRewards = async () => {
    try {
      const res = await fetch('/api/rewards');
      const data = await res.json();
      setRewards(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  return (
    <div>
      <h1>Donor Rewards</h1>
      <ul>
        {rewards.map((reward) => (
          <li key={reward.id}>
            {reward.title} - {reward.pointsRequired} points
            <p>{reward.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
