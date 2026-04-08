import mongoose, { Schema, Document, Model } from 'mongoose';

interface IFoodBank extends Document {
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  location: { lat: number; lng: number };
}

const foodBankSchema: Schema<IFoodBank> = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    location: { lat: Number, lng: Number, required: true },
  },
  { timestamps: true },
);

export const FoodBank: Model<IFoodBank> = mongoose.model<IFoodBank>('FoodBank', foodBankSchema);
