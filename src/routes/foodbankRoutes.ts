import { Router } from 'express';
import { getAllFoodBanks } from '../controllers/foodbankController';

export const foodBankRoutes = Router();

foodBankRoutes.get('/', getAllFoodBanks);
