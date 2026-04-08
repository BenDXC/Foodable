import { Request, Response } from 'express';

import { FoodBank } from '../models/foodbank.model';

export const getAllFoodBanks = async (_req: Request, res: Response) => {
  try {
    const banks = await FoodBank.find();
    res.status(200).json(banks);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
