import axios from 'axios';
import { CheckRequest, CheckResponse } from '@/types/weather';

const API_BASE_URL = 'http://172.32.248.95:8000/api';

export const weatherApi = {
  checkWeather: async (data: CheckRequest): Promise<CheckResponse> => {
    const response = await axios.post<CheckResponse>(`${API_BASE_URL}/check`, data);
    return response.data;
  },

  exportCSV: async (data: CheckRequest): Promise<Blob> => {
    const response = await axios.post(`${API_BASE_URL}/export/csv`, data, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportJSON: async (data: CheckRequest): Promise<Blob> => {
    const response = await axios.post(`${API_BASE_URL}/export/json`, data, {
      responseType: 'blob',
    });
    return response.data;
  },
};