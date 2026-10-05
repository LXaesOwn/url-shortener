import express from 'express';
import { env } from './config/env';
import { applySecurityMiddleware } from './middleware/securityHeaders';
import { limiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes';
import { StatusCodes } from 'http-status-codes';
import os from 'os';

const app = express();
const PORT = env.PORT;

applySecurityMiddleware(app);
app.use(limiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

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
});
