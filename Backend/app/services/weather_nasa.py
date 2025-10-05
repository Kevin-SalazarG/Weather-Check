import requests
from datetime import date
import numpy as np

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
        "parameters": "T2M,PRECTOTCORR,WS10M,RH2M",
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
    
    temps_by_year = {}
    precip_by_year = {}
    wind_by_year = {}
    humidity_by_year = {}
    
    for date_str, temp in props.get("T2M", {}).items():
        if temp != -999:
            year_key = int(date_str[:4])
            if year_key not in temps_by_year:
                temps_by_year[year_key] = []
            temps_by_year[year_key].append(temp)
    
    for date_str, prec in props.get("PRECTOTCORR", {}).items():
        if prec != -999:
            year_key = int(date_str[:4])
            if year_key not in precip_by_year:
                precip_by_year[year_key] = []
            precip_by_year[year_key].append(prec)
    
    for date_str, w in props.get("WS10M", {}).items():
        if w != -999:
            year_key = int(date_str[:4])
            if year_key not in wind_by_year:
                wind_by_year[year_key] = []
            wind_by_year[year_key].append(w)
    
    for date_str, h in props.get("RH2M", {}).items():
        if h != -999:
            year_key = int(date_str[:4])
            if year_key not in humidity_by_year:
                humidity_by_year[year_key] = []
            humidity_by_year[year_key].append(h)
    
    avg_temp = _weighted_average_recent(temps_by_year, event_date.year)
    avg_precip = _weighted_average_recent(precip_by_year, event_date.year)
    avg_wind = _weighted_average_recent(wind_by_year, event_date.year)
    avg_humidity = _weighted_average_recent(humidity_by_year, event_date.year)
    
    all_temps = [t for temps in temps_by_year.values() for t in temps]
    all_temps_filtered = _remove_outliers(all_temps)
    
    total_points = sum(len(v) for v in temps_by_year.values())
    
    return {
        "avg_temp_c": round(avg_temp, 2) if avg_temp else 20,
        "min_temp_c": round(np.percentile(all_temps_filtered, 10), 2) if all_temps_filtered else 15,
        "max_temp_c": round(np.percentile(all_temps_filtered, 90), 2) if all_temps_filtered else 25,
        "avg_precipitation_mmhr": round(avg_precip, 2) if avg_precip else 0.5,
        "avg_wind_speed_kmh": round(avg_wind * 3.6, 2) if avg_wind else 15,
        "avg_humidity_percent": round(avg_humidity, 2) if avg_humidity else 50,
        "avg_cloud_cover_percent": 40.0,
        "data_source": "NASA POWER",
        "years_analyzed": total_points
    }

def _weighted_average_recent(data_by_year: dict, current_year: int):
    if not data_by_year:
        return None
    
    weighted_sum = 0
    total_weight = 0
    
    for year, values in data_by_year.items():
        values_filtered = _remove_outliers(values)
        if values_filtered:
            avg_year = np.mean(values_filtered)
            years_ago = current_year - year
            weight = 1 / (1 + years_ago * 0.1)
            
            weighted_sum += avg_year * weight
            total_weight += weight
    
    return weighted_sum / total_weight if total_weight > 0 else None

def _remove_outliers(data):
    if not data or len(data) < 4:
        return data
    
    q1 = np.percentile(data, 25)
    q3 = np.percentile(data, 75)
    iqr = q3 - q1
    lower_bound = q1 - (1.5 * iqr)
    upper_bound = q3 + (1.5 * iqr)
    
    return [x for x in data if lower_bound <= x <= upper_bound]     

def _get_fallback_data():
    return {
        "avg_temp_c": 20,
        "avg_precipitation_mmhr": 0.5,
        "avg_wind_speed_kmh": 15,
        "avg_humidity_percent": 50,
        "avg_cloud_cover_percent": 40,
        "data_source": "fallback",
        "years_analyzed": 0
    }