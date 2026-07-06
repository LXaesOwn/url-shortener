import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes';
import statsRoutes from './routes/statsRoutes';
import { env } from './config/env';
import { StatusCodes } from 'http-status-codes';
import os from 'os';

dotenv.config();

const app = express();
const PORT = env.PORT;

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', statsRoutes);
app.use('/api', urlRoutes);

app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const interfaces = os.networkInterfaces();
for (const name of Object.keys(interfaces)) {
  for (const net of interfaces[name] || []) {
    if (net.family === 'IPv4' && !net.internal) {
      console.log(`📍 Network: http://${net.address}:${PORT}`);
    }
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
});