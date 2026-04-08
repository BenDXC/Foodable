export interface Donation {
  _id: string;
  donorId: string;
  foodItem: string;
  quantity: number;
  expiryDate: string;
  location: string;
  status: 'available' | 'claimed';
}

export interface FoodBank {
  _id: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  location: { lat: number; lng: number };
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
}
