import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes';
import statsRoutes from './routes/statsRoutes';
import { CONSTANTS } from './config/constants';
import os from 'os';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(CONSTANTS.API_PREFIX, statsRoutes);
// Потом редиректы
app.use(CONSTANTS.API_PREFIX, urlRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`📍 Network: http://${net.address}:${PORT}`);
      }
    }
  }
  console.log(`📍 API available at http://localhost:${PORT}${CONSTANTS.API_PREFIX}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});