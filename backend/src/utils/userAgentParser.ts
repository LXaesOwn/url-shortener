
export const BROWSER_PATTERNS: Record<string, RegExp> = {
  Chrome: /Chrome\/(\d+\.\d+)/,
  Firefox: /Firefox\/(\d+\.\d+)/,
  Safari: /Safari\/(\d+\.\d+)/,
  Edge: /Edg\/(\d+\.\d+)/,
  Opera: /OPR\/(\d+\.\d+)/,
};


export const OS_PATTERNS: Record<string, RegExp> = {
  Windows: /Windows NT (\d+\.\d+)/,
  MacOS: /Mac OS X (\d+[._]\d+)/,
  Linux: /Linux/,
  iOS: /iPhone|iPad|iPod/,
  Android: /Android/,
};

export interface ParsedUserAgent {
  browser: string;
  browserVersion: string;
  os: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
}

export function parseUserAgent(userAgentString: string): ParsedUserAgent {
  let browser = 'unknown';
  let browserVersion = 'unknown';
  let os = 'unknown';
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';


  for (const [name, pattern] of Object.entries(BROWSER_PATTERNS)) {
    const match = userAgentString.match(pattern);
    if (match) {
      browser = name.toLowerCase();
      browserVersion = match[1] || 'unknown';
      break;
    }
  }

  for (const [name, pattern] of Object.entries(OS_PATTERNS)) {
    if (pattern.test(userAgentString)) {
      os = name.toLowerCase();
      break;
    }
  }

 
  if (/Mobile|Android|iPhone|iPod/i.test(userAgentString)) {
    deviceType = 'mobile';
  } else if (/Tablet|iPad/i.test(userAgentString)) {
    deviceType = 'tablet';
  }

  return { browser, browserVersion, os, deviceType };
}