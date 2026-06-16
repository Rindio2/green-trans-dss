import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ZodError } from 'zod';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import scenarioRoutes from './routes/scenario.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

let dbConnectionPromise;

function ensureDBConnection() {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }
  return dbConnectionPromise;
}

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.use(async (req, res, next) => {
  try {
    await ensureDBConnection();
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GreenTrans DSS API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/scenarios', scenarioRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.errors
    });
  }

  res.status(error.status || 500).json({
    message: error.message || 'Internal server error'
  });
});

if (!process.env.VERCEL) {
  ensureDBConnection()
    .then(() => {
      app.listen(port, () => {
        console.log(`GreenTrans DSS API running on http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
}

export default app;
  });
