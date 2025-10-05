export interface CheckRequest {
  activity: string;
  location: string;
  date: string;
}

export interface WeatherData {
  avg_temp_c: number;
  min_temp_c?: number;
  max_temp_c?: number;
  avg_precipitation_mmhr: number;
  avg_wind_speed_kmh: number;
  avg_humidity_percent: number;
  avg_cloud_cover_percent: number;
  data_source: string;
  years_analyzed: number;
}

export interface CheckResponse {
  score: number;
  classification: string;
  justification: string;
  weather_data?: WeatherData;
  request_data: CheckRequest;
}