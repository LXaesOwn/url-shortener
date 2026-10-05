import axios from 'axios';
import { CONSTANTS } from '../config/constants';
import { ICreateUrlResponse, IStatsResponse } from '../types';

const api = axios.create({
  baseURL: CONSTANTS.API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: CONSTANTS.API_TIMEOUT_MS,
});

export const shortenUrl = async (originalUrl: string): Promise<ICreateUrlResponse> => {
  const response = await api.post<ICreateUrlResponse>('/shorten', { originalUrl });
  return response.data;
};

export const getStats = async (shortCode: string): Promise<IStatsResponse> => {
  const response = await api.get<IStatsResponse>(`/stats/${shortCode}`);
  return response.data;
};

export default api;