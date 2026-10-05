export const CONSTANTS = {
  SHORT_CODE_LENGTH: 6,
  MAX_ORIGINAL_URL_LENGTH: 2048,
  MAX_GENERATION_ATTEMPTS: 1000,
  API_PREFIX: '/api',
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  RATE_LIMIT_MAX: 100,
  JSON_BODY_LIMIT: '10kb',
  API_TIMEOUT_MS: 10000,
} as const;

export const UNKNOWN = 'unknown';
export const DIRECT = 'direct';
export const LOCALHOST = 'localhost';
export const LOCAL_NETWORK = 'local_network';
export const GEO_UNAVAILABLE = 'geo_unavailable';
