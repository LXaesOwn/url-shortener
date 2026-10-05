export const CONSTANTS = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  COPY_TIMEOUT_MS: 2000,
  API_TIMEOUT_MS: 10000,
  MAX_URL_LENGTH: 2048,
  SHORT_CODE_PATH_RE: /\/s\/([a-zA-Z0-9]+)/,
} as const;
