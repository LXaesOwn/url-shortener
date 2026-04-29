const axios = require('axios');

const GEO_API_URL = 'http://ip-api.com/json';
const REQUEST_TIMEOUT_MS = 3000;

async function getRegionByIp(ip) {
  if (ip === '::1' || ip === '127.0.0.1') {
    return 'Localhost';
  }
  try {
    const response = await axios.get(`${GEO_API_URL}/${ip}`, {
      timeout: REQUEST_TIMEOUT_MS
    });
    if (response.data && response.data.status === 'success') {
      return response.data.regionName || response.data.country || 'Unknown';
    }
    return 'Unknown';
  } catch (error) {
    return 'Unknown';
  }
}

module.exports = { getRegionByIp };
