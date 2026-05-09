import axios from 'axios';
import { CONSTANTS } from '../config/constants';

const api = axios.create({
  baseURL: CONSTANTS.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const shortenUrl = async (originalUrl: string) => {
  const response = await api.post('/shorten', { originalUrl });
  return response.data;
};

export const getStats = async (shortCode: string) => {
  const response = await api.get(`/stats/${shortCode}`);
  return response.data;
};

export default api;