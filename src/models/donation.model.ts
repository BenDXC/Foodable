import mongoose, { Schema, Document, Model } from 'mongoose';

interface IDonation extends Document {
  donorId: string;
  foodItem: string;
  quantity: number;
  expiryDate: Date;
  location: string;
  status: 'available' | 'claimed';
}

const donationSchema: Schema<IDonation> = new Schema(
  {
    donorId: { type: String, required: true },
    foodItem: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    location: { type: String, required: true },
    status: { type: String, default: 'available' },
  },
  { timestamps: true },
);

export const Donation: Model<IDonation> = mongoose.model<IDonation>('Donation', donationSchema);
