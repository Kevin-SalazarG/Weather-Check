export interface CheckRequest {
  activity: string;
  location: string;
  date: string;
}

export interface TemperatureDistribution {
  mean: number;
  std: number;
  percentiles: {
    '10': number;
    '25': number;
    '50': number;
    '75': number;
    '90': number;
  };
}

export interface ProbabilityDetail {
  probability: number;
  threshold: number;
  confidence: string;
}

export interface ExtremeProbabilities {
  very_hot: ProbabilityDetail;
  very_cold: ProbabilityDetail;
  very_wet: ProbabilityDetail;
  very_windy: ProbabilityDetail;
  uncomfortable_humidity: ProbabilityDetail;
}

export interface WeatherData {
  avg_temp_c: number;
  min_temp_c: number;
  max_temp_c: number;
  avg_precipitation_mmhr: number;
  avg_wind_speed_kmh: number;
  avg_humidity_percent: number;
  avg_cloud_cover_percent: number;
  avg_uv_index: number;
  data_source: string;
  years_analyzed: number;
  temperature_distribution: TemperatureDistribution;
}

export interface CheckResponse {
  score: number;
  classification: string;
  justification: string;
  weather_data: WeatherData;
  request_data: CheckRequest;
  probabilities: ExtremeProbabilities;
  recommendations: string[];
}

export interface TrendData {
  year: number;
  avg_temp: number | null;
  total_precip: number | null;
  extreme_heat_days: number;
  extreme_cold_days: number;
  heavy_rain_days: number;
}

export interface TrendAnalysis {
  temp_change_per_decade: number;
  increasing_extreme_events: boolean;
}

export interface ClimateTrendsResponse {
  trend_direction: string;
  temperature_trend: number;
  precipitation_trend: number;
  yearly_data: TrendData[];
  analysis: TrendAnalysis;
}

export interface LocationData {
  location: string;
  score: number;
  weather_data: WeatherData;
  probabilities: ExtremeProbabilities;
}

export interface ComparisonResponse {
  best_location: string;
  comparison_data: LocationData[];
  activity: string;
  date: string;
}

export interface LocationComparisonRequest {
  locations: string[];
  date: string;
  activity: string;
}