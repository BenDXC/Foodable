import { Request, Response } from 'express';

import { hashPassword, verifyPassword } from '../utils/authUtils';
import { User } from '../models/user.model';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashed = await hashPassword(password);
    const user = await User.create({ email, password: hashed });
    res.status(201).json({ message: 'User registered', userId: user.id });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    res.status(200).json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
