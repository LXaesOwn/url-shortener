import axios from 'axios';

const GEO_API_URL = process.env.GEO_API_URL || 'http://ip-api.com/json/';

export class GeoService {
  static async getRegion(ip: string): Promise<string> {
    try {
      if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
        return 'Local Development';
      }

      const response = await axios.get(`${GEO_API_URL}${ip}`, {
        params: { fields: 'country,regionName,city' }
      });
      
      if (response.data && response.data.status === 'success') {
        const { country, regionName, city } = response.data;
        return `${country}, ${regionName}, ${city}`;
      }
      
      return 'Unknown Region';
    } catch (error) {
      console.error('Geo service error:', error);
      return 'Unknown Region';
    }
  }
}
