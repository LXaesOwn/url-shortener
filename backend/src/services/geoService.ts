import axios from 'axios';

const GEO_API_URL = process.env.GEO_API_URL || 'http://ip-api.com/json/';


interface GeoResponse {
  status: string;
  country?: string;
  regionName?: string;
  city?: string;
}


export const LOCATION_TYPE = {
  LOCALHOST: 'localhost',
  LOCAL_NETWORK: 'local_network',
  UNKNOWN: 'unknown',
} as const;


export async function fetchGeoData(ip: string): Promise<GeoResponse | null> {
  try {
    const response = await axios.get(`${GEO_API_URL}${ip}`, {
      params: { fields: 'status,country,regionName,city' },
      timeout: 3000,
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