import axios from 'axios';

const GEO_API_URL = process.env.GEO_API_URL || 'http://ip-api.com/json/';

export class GeoService {
  static async getRegion(ip: string): Promise<string> {
    try {
      
      if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
        return 'Localhost (тестовый)';
      }
      
      
      if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        return 'Локальная сеть';
      }
      
      
      const response = await axios.get(`${GEO_API_URL}${ip}`, {
        params: { fields: 'country,regionName,city,status' },
        timeout: 3000
      });
      
      if (response.data && response.data.status === 'success') {
        const { country, regionName, city } = response.data;
        return `${country}, ${regionName}, ${city}`;
      }
      
      return 'Регион не определен';
    } catch (error) {
      console.error('Geo service error for IP:', ip, error);
      return 'Регион не определен';
    }
  }
}