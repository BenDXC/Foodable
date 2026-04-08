import { Request, Response } from 'express';

import { Donation } from '../models/donation.model';

export const createDonation = async (req: Request, res: Response) => {
  try {
    const donation = await Donation.create(req.body);
    res.status(201).json({ message: 'Donation created', donation });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getAllDonations = async (_req: Request, res: Response) => {
  try {
    const donations = await Donation.find({ status: 'available' });
    res.status(200).json(donations);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
