import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔧 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,

  validateStatus: (status) => status < 400
});

api.interceptors.request.use(request => {
  console.log('📤 Request:', request.method?.toUpperCase(), request.url);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('📥 Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('❌ API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const shortenUrl = async (originalUrl: string) => {
  console.log('🔗 Shortening URL:', originalUrl);
  const response = await api.post('/shorten', { originalUrl });
  return response.data;
};

export const getStats = async (shortCode: string) => {
  console.log('📊 Getting stats for shortCode:', shortCode);
  const response = await api.get(`/stats/${shortCode}`);
  return response.data;
};

export default api;