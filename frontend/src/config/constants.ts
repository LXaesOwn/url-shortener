export const CONSTANTS = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  COPY_TIMEOUT_MS: 2000,
} as const;
