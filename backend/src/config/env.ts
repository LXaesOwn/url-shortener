import 'dotenv/config';

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/url_shortener?schema=public',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_NAME: process.env.DB_NAME || 'url_shortener',

  BASE_URL: process.env.BASE_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  GEO_API_URL: process.env.GEO_API_URL || 'http://ip-api.com/json/',
  GEO_API_TIMEOUT_MS: parseInt(process.env.GEO_API_TIMEOUT_MS || '3000', 10),
} as const;

export type Env = typeof env;