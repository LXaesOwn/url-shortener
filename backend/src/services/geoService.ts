import axios from 'axios';
import { env } from '../config/env';

export const LOCATION_TYPE = {
  LOCALHOST: 'localhost',
  LOCAL_NETWORK: 'local_network',
  UNKNOWN: 'unknown',
} as const;

export async function fetchGeoData(ip: string) {
  try {
    const response = await axios.get(`${env.GEO_API_URL}${ip}`, {
      params: { fields: 'status,country,regionName,city' },
      timeout: env.GEO_API_TIMEOUT_MS,
    });
    return response.data;
  } catch (error) {
    console.error(`Geo API error for IP ${ip}:`, error);
    return null;
  }
}

export async function getRegion(ip: string): Promise<string> {
  if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
    return LOCATION_TYPE.LOCALHOST;
  }

  if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    return LOCATION_TYPE.LOCAL_NETWORK;
  }

  const data = await fetchGeoData(ip);
  if (data?.status === 'success') {
    const { country, regionName, city } = data;
    return `${country || 'unknown'}, ${regionName || 'unknown'}, ${city || 'unknown'}`;
  }

  return LOCATION_TYPE.UNKNOWN;
}