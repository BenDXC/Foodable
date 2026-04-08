import { Router } from 'express';
import { createDonation, getAllDonations } from '../controllers/donationController';

export const donationRoutes = Router();

donationRoutes.post('/', createDonation);
donationRoutes.get('/', getAllDonations);
