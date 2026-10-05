import 'dotenv/config';

function required(value: string | undefined, name: string): string {
  if (!value || value.trim() === '') {
    throw new Error(`❌ Environment variable "${name}" is required but not set.`);
  }
  return value;
}

function defaultString(value: string | undefined, defaultValue: string): string {
  return value || defaultValue;
}

function defaultNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export const env = {
  PORT: defaultNumber(process.env.PORT, 5000),
  NODE_ENV: defaultString(process.env.NODE_ENV, 'development'),
  DATABASE_URL: required(process.env.DATABASE_URL, 'DATABASE_URL'),
  DB_HOST: defaultString(process.env.DB_HOST, 'localhost'),
  DB_PORT: defaultNumber(process.env.DB_PORT, 5432), 
  DB_USER: defaultString(process.env.DB_USER, 'postgres'),
  DB_PASSWORD: required(process.env.DB_PASSWORD, 'DB_PASSWORD'),
  DB_NAME: defaultString(process.env.DB_NAME, 'url_shortener'),
  BASE_URL: required(process.env.BASE_URL, 'BASE_URL'),
  FRONTEND_URL: defaultString(process.env.FRONTEND_URL, 'http://localhost:3000'),
  GEO_API_URL: defaultString(process.env.GEO_API_URL, 'http://ip-api.com/json/'),
  GEO_API_TIMEOUT_MS: defaultNumber(process.env.GEO_API_TIMEOUT_MS, 3000),
  LOG_LEVEL: defaultString(process.env.LOG_LEVEL, 'info'),
} as const;

export type Env = typeof env;

console.log('✅ Environment variables loaded:');
console.log(`   PORT: ${env.PORT}`);
console.log(`   NODE_ENV: ${env.NODE_ENV}`);
console.log(`   DATABASE_URL: ${env.DATABASE_URL ? '✓ set' : '✗ missing'}`);
console.log(`   BASE_URL: ${env.BASE_URL}`);
console.log(`   FRONTEND_URL: ${env.FRONTEND_URL}`);