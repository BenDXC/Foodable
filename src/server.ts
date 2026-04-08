import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { containerMiddleware } from './middleware/container.js';
import { connectDB } from './config/database.config';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Attach all routes
containerMiddleware(app);

// Connect to DB
connectDB();

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
