import axios from 'axios';
import { 
  CheckRequest, 
  CheckResponse, 
  ExtremeProbabilities,
  ClimateTrendsResponse,
  LocationComparisonRequest,
  ComparisonResponse
} from '@/types/weather';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const weatherApi = {
  checkWeather: async (data: CheckRequest): Promise<CheckResponse> => {
    const response = await axios.post<CheckResponse>(`${API_BASE_URL}/check`, data);
    return response.data;
  },

  getProbabilities: async (data: CheckRequest): Promise<ExtremeProbabilities> => {
    const response = await axios.post<ExtremeProbabilities>(`${API_BASE_URL}/probabilities`, data);
    return response.data;
  },

  getClimateTrends: async (location: string, startYear?: number, endYear?: number): Promise<ClimateTrendsResponse> => {
    const params = new URLSearchParams();
    if (startYear) params.append('start_year', startYear.toString());
    if (endYear) params.append('end_year', endYear.toString());
    
    const response = await axios.get<ClimateTrendsResponse>(
      `${API_BASE_URL}/trends/${encodeURIComponent(location)}?${params.toString()}`
    );
    return response.data;
  },

  compareLocations: async (data: LocationComparisonRequest): Promise<ComparisonResponse> => {
    const response = await axios.post<ComparisonResponse>(`${API_BASE_URL}/compare`, data);
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