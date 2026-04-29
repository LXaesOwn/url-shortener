import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const linkApi = {
  shortenLink: (originalUrl) => api.post('/shorten', { originalUrl }),
  getStats: (shortCode) => api.get(`/stats/${shortCode}`),
  getAllLinks: () => api.get('/api/links'),
};

export default api;
