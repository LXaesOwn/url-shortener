export const CONSTANTS = {
  SHORT_CODE_LENGTH: 6,
  MAX_ORIGINAL_URL_LENGTH: 2048,
  API_PREFIX: '/api',
  
  HTTP_STATUS: {
    OK: 302,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },
  
  BROWSER_PATTERNS: {
    'Chrome': /Chrome\/(\d+\.\d+)/,
    'Firefox': /Firefox\/(\d+\.\d+)/,
    'Safari': /Safari\/(\d+\.\d+)/,
    'Edge': /Edg\/(\d+\.\d+)/,
    'Opera': /OPR\/(\d+\.\d+)/
  },
  
  OS_PATTERNS: {
    'Windows': /Windows NT (\d+\.\d+)/,
    'Mac OS': /Mac OS X (\d+[._]\d+)/,
    'Linux': /Linux/,
    'iOS': /iPhone|iPad|iPod/,
    'Android': /Android/
  }
} as const;