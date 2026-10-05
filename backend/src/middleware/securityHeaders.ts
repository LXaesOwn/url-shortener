import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { Express } from 'express';
import { env } from '../config/env';

export function applySecurityMiddleware(app: Express): void {
  app.use(helmet());
  app.use(compression());
  app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
}
