import requests
from datetime import date, timedelta
import numpy as np
from scipy import stats

def get_historical_weather(lat: float, lon: float, event_date: date):
    try:
        return _get_nasa_power_data(lat, lon, event_date)
    except Exception as e:
        print(f"NASA POWER Error: {e}")
        return _get_fallback_data()

def _get_nasa_power_data(lat: float, lon: float, event_date: date):
    year = event_date.year
    month = event_date.month
    day = event_date.day
    
    start_date = f"{year-10}{month:02d}{day:02d}"
    end_date = f"{year-1}{month:02d}{day:02d}"
    
    params = {
        "parameters": "T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,WS10M,RH2M,CLOUD_AMT,ALLSKY_SFC_UV_INDEX",
        "community": "RE",
        "longitude": lon,
        "latitude": lat,
        "start": start_date,
        "end": end_date,
        "format": "JSON"
    }
    
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    
    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()
    
    data = response.json()
    props = data["properties"]["parameter"]
    
    all_temps = []
    all_max_temps = []
    all_min_temps = []
    all_precip = []
    all_wind = []
    all_humidity = []
    all_cloud = []
    all_uv = []
    
    for date_str in props.get("T2M", {}):
        if props["T2M"][date_str] != -999:
            all_temps.append(props["T2M"][date_str])
        if "T2M_MAX" in props and props["T2M_MAX"].get(date_str, -999) != -999:
            all_max_temps.append(props["T2M_MAX"][date_str])
        if "T2M_MIN" in props and props["T2M_MIN"].get(date_str, -999) != -999:
            all_min_temps.append(props["T2M_MIN"][date_str])
        if "PRECTOTCORR" in props and props["PRECTOTCORR"].get(date_str, -999) != -999:
            all_precip.append(props["PRECTOTCORR"][date_str])
        if "WS10M" in props and props["WS10M"].get(date_str, -999) != -999:
            all_wind.append(props["WS10M"][date_str])
        if "RH2M" in props and props["RH2M"].get(date_str, -999) != -999:
            all_humidity.append(props["RH2M"][date_str])
        if "CLOUD_AMT" in props and props["CLOUD_AMT"].get(date_str, -999) != -999:
            all_cloud.append(props["CLOUD_AMT"][date_str])
        if "ALLSKY_SFC_UV_INDEX" in props and props["ALLSKY_SFC_UV_INDEX"].get(date_str, -999) != -999:
            all_uv.append(props["ALLSKY_SFC_UV_INDEX"][date_str])
    
    result = {
        "avg_temp_c": float(np.mean(all_temps)) if all_temps else 20.0,
        "min_temp_c": float(np.percentile(all_min_temps, 10)) if all_min_temps else 15.0,
        "max_temp_c": float(np.percentile(all_max_temps, 90)) if all_max_temps else 25.0,
        "avg_precipitation_mmhr": float(np.mean(all_precip)) if all_precip else 0.5,
        "avg_wind_speed_kmh": float(np.mean(all_wind) * 3.6) if all_wind else 15.0,
        "avg_humidity_percent": float(np.mean(all_humidity)) if all_humidity else 50.0,
        "avg_cloud_cover_percent": float(np.mean(all_cloud)) if all_cloud else 40.0,
        "avg_uv_index": float(np.mean(all_uv)) if all_uv else 5.0,
        "data_source": "NASA POWER",
        "years_analyzed": len(all_temps),
        "temperature_distribution": {
            "mean": float(np.mean(all_temps)) if all_temps else 20.0,
            "std": float(np.std(all_temps)) if all_temps else 5.0,
            "percentiles": {
                "10": float(np.percentile(all_temps, 10)) if all_temps else 15.0,
                "25": float(np.percentile(all_temps, 25)) if all_temps else 17.0,
                "50": float(np.percentile(all_temps, 50)) if all_temps else 20.0,
                "75": float(np.percentile(all_temps, 75)) if all_temps else 23.0,
                "90": float(np.percentile(all_temps, 90)) if all_temps else 25.0
            }
        },
        "raw_data": {
            "temperatures": all_temps,
            "precipitation": all_precip,
            "wind": all_wind,
            "humidity": all_humidity
        }
    }
    
    return result

def calculate_extreme_probabilities(weather_data: dict):
    temps = weather_data.get("raw_data", {}).get("temperatures", [])
    precip = weather_data.get("raw_data", {}).get("precipitation", [])
    wind = weather_data.get("raw_data", {}).get("wind", [])
    humidity = weather_data.get("raw_data", {}).get("humidity", [])
    
    if not temps:
        return _get_default_probabilities()
    
    temp_mean = np.mean(temps)
    temp_std = np.std(temps)
    
    prob_very_hot = float((1 - stats.norm.cdf(32, temp_mean, temp_std)) * 100)
    prob_very_cold = float(stats.norm.cdf(5, temp_mean, temp_std) * 100)
    
    if precip:
        precip_mean = np.mean(precip)
        precip_std = np.std(precip)
        prob_very_wet = float((1 - stats.norm.cdf(2, precip_mean, precip_std)) * 100)
    else:
        prob_very_wet = 10.0
    
    if wind:
        wind_kmh = [w * 3.6 for w in wind]
        wind_mean = np.mean(wind_kmh)
        wind_std = np.std(wind_kmh)
        prob_very_windy = float((1 - stats.norm.cdf(30, wind_mean, wind_std)) * 100)
    else:
        prob_very_windy = 15.0
    
    if humidity:
        humidity_mean = np.mean(humidity)
        humidity_std = np.std(humidity)
        prob_uncomfortable = float((1 - stats.norm.cdf(75, humidity_mean, humidity_std)) * 100)
    else:
        prob_uncomfortable = 20.0
    
    return {
        "very_hot": {
            "probability": min(100, max(0, prob_very_hot)),
            "threshold": 32,
            "confidence": _get_confidence_level(len(temps))
        },
        "very_cold": {
            "probability": min(100, max(0, prob_very_cold)),
            "threshold": 5,
            "confidence": _get_confidence_level(len(temps))
        },
        "very_wet": {
            "probability": min(100, max(0, prob_very_wet)),
            "threshold": 2,
            "confidence": _get_confidence_level(len(precip))
        },
        "very_windy": {
            "probability": min(100, max(0, prob_very_windy)),
            "threshold": 30,
            "confidence": _get_confidence_level(len(wind))
        },
        "uncomfortable_humidity": {
            "probability": min(100, max(0, prob_uncomfortable)),
            "threshold": 75,
            "confidence": _get_confidence_level(len(humidity))
        }
    }

def get_climate_trends(lat: float, lon: float, location: str, start_year: int = 2014, end_year: int = 2023):
    yearly_data = []
    
    for year in range(start_year, end_year + 1):
        try:
            params = {
                "parameters": "T2M,PRECTOTCORR,WS10M",
                "community": "RE",
                "longitude": lon,
                "latitude": lat,
                "start": f"{year}0101",
                "end": f"{year}1231",
                "format": "JSON"
            }
            
            response = requests.get(
                "https://power.larc.nasa.gov/api/temporal/daily/point",
                params=params,
                timeout=30
            )
            response.raise_for_status()
            
            data = response.json()
            props = data["properties"]["parameter"]
            
            year_temps = [v for v in props["T2M"].values() if v != -999]
            year_precip = [v for v in props["PRECTOTCORR"].values() if v != -999]
            
            extreme_heat_days = len([t for t in year_temps if t > 32])
            extreme_cold_days = len([t for t in year_temps if t < 5])
            heavy_rain_days = len([p for p in year_precip if p > 10])
            
            yearly_data.append({
                "year": year,
                "avg_temp": float(np.mean(year_temps)) if year_temps else None,
                "total_precip": float(np.sum(year_precip)) if year_precip else None,
                "extreme_heat_days": extreme_heat_days,
                "extreme_cold_days": extreme_cold_days,
                "heavy_rain_days": heavy_rain_days
            })
        except:
            continue
    
    if len(yearly_data) < 3:
        return {
            "trend_direction": "insufficient_data",
            "temperature_trend": 0,
            "precipitation_trend": 0,
            "yearly_data": yearly_data
        }
    
    years = [d["year"] for d in yearly_data if d["avg_temp"] is not None]
    temps = [d["avg_temp"] for d in yearly_data if d["avg_temp"] is not None]
    
    if len(years) >= 3:
        temp_trend = np.polyfit(years, temps, 1)[0]
    else:
        temp_trend = 0
    
    precip_data = [d["total_precip"] for d in yearly_data if d["total_precip"] is not None]
    if len(precip_data) >= 3:
        precip_trend = np.polyfit(range(len(precip_data)), precip_data, 1)[0]
    else:
        precip_trend = 0
    
    return {
        "trend_direction": "increasing" if temp_trend > 0 else "decreasing",
        "temperature_trend": float(temp_trend),
        "precipitation_trend": float(precip_trend),
        "yearly_data": yearly_data,
        "analysis": {
            "temp_change_per_decade": float(temp_trend * 10),
            "increasing_extreme_events": sum([d["extreme_heat_days"] for d in yearly_data[-3:]]) > sum([d["extreme_heat_days"] for d in yearly_data[:3]])
        }
    }

def _get_confidence_level(sample_size: int) -> str:
    if sample_size >= 1000:
        return "HIGH"
    elif sample_size >= 500:
        return "MEDIUM"
    elif sample_size >= 100:
        return "LOW"
    else:
        return "VERY_LOW"

def _get_default_probabilities():
    return {
        "very_hot": {"probability": 15.0, "threshold": 32, "confidence": "LOW"},
        "very_cold": {"probability": 10.0, "threshold": 5, "confidence": "LOW"},
        "very_wet": {"probability": 20.0, "threshold": 2, "confidence": "LOW"},
        "very_windy": {"probability": 15.0, "threshold": 30, "confidence": "LOW"},
        "uncomfortable_humidity": {"probability": 25.0, "threshold": 75, "confidence": "LOW"}
    }

def _get_fallback_data():
    return {
        "avg_temp_c": 20.0,
        "min_temp_c": 15.0,
        "max_temp_c": 25.0,
        "avg_precipitation_mmhr": 0.5,
        "avg_wind_speed_kmh": 15.0,
        "avg_humidity_percent": 50.0,
        "avg_cloud_cover_percent": 40.0,
        "avg_uv_index": 5.0,
        "data_source": "fallback",
        "years_analyzed": 0,
        "temperature_distribution": {
            "mean": 20.0,
            "std": 5.0,
            "percentiles": {
                "10": 15.0,
                "25": 17.0,
                "50": 20.0,
                "75": 23.0,
                "90": 25.0
            }
        },
        "raw_data": {
            "temperatures": [],
            "precipitation": [],
            "wind": [],
            "humidity": []
        }
    }