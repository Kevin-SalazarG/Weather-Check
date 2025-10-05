from pydantic import BaseModel
from datetime import date
from typing import Optional, Dict, List, Any

class CheckRequest(BaseModel):
    activity: str
    location: str
    date: date

class TemperatureDistribution(BaseModel):
    mean: float
    std: float
    percentiles: Dict[str, float]

class ProbabilityDetail(BaseModel):
    probability: float
    threshold: float
    confidence: str

class ExtremeProbabilities(BaseModel):
    very_hot: ProbabilityDetail
    very_cold: ProbabilityDetail
    very_wet: ProbabilityDetail
    very_windy: ProbabilityDetail
    uncomfortable_humidity: ProbabilityDetail

class WeatherData(BaseModel):
    avg_temp_c: float
    min_temp_c: float
    max_temp_c: float
    avg_precipitation_mmhr: float
    avg_wind_speed_kmh: float
    avg_humidity_percent: float
    avg_cloud_cover_percent: float
    avg_uv_index: float
    data_source: str
    years_analyzed: int
    temperature_distribution: TemperatureDistribution

class CheckResponse(BaseModel):
    score: int
    classification: str
    justification: str
    weather_data: WeatherData
    request_data: CheckRequest
    probabilities: ExtremeProbabilities
    recommendations: List[str]

class TrendData(BaseModel):
    year: int
    avg_temp: Optional[float]
    total_precip: Optional[float]
    extreme_heat_days: int
    extreme_cold_days: int
    heavy_rain_days: int

class TrendAnalysis(BaseModel):
    temp_change_per_decade: float
    increasing_extreme_events: bool

class ClimateTrendsResponse(BaseModel):
    trend_direction: str
    temperature_trend: float
    precipitation_trend: float
    yearly_data: List[TrendData]
    analysis: TrendAnalysis

class LocationComparisonRequest(BaseModel):
    locations: List[str]
    date: date
    activity: str

class LocationData(BaseModel):
    location: str
    score: int
    weather_data: WeatherData
    probabilities: ExtremeProbabilities

class ComparisonResponse(BaseModel):
    best_location: str
    comparison_data: List[LocationData]
    activity: str
    date: date