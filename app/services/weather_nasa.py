from datetime import date

def get_historical_weather(lat: float, lon: float, event_date: date):
    
    print(f"Simulating NASA API call for coords: ({lat}, {lon}) on date: {event_date}")
    
    mock_weather_data = {
        "avg_temp_c": 28.5,
        "avg_precipitation_mmhr": 0.2,
        "avg_cloud_cover_percent": 35.0,
        "avg_wind_speed_kmh": 15.0,
        "avg_humidity_percent": 65.0
    }
    
    return mock_weather_data