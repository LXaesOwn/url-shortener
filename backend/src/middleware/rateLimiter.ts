import rateLimit from 'express-rate-limit';
import { CONSTANTS } from '../config/constants';

export const limiter = rateLimit({
  windowMs: CONSTANTS.RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: CONSTANTS.RATE_LIMIT_MAX, // 100 requests per IP
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
