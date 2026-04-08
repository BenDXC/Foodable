import { Application } from 'express';

import { donationRoutes } from '../routes/donationRoutes';
import { userRoutes } from '../routes/userRoutes';
import { foodBankRoutes } from '../routes/foodbankRoutes';

export const containerMiddleware = (app: Application) => {
  // Health check
  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  // API Routes
  app.use('/api/donations', donationRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/foodbanks', foodBankRoutes);

  // Catch-all route for 404
  app.use('*', (_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });
};
