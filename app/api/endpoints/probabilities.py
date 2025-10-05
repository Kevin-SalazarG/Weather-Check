from fastapi import APIRouter, HTTPException
from app.schemas import CheckRequest
from app.services import geocoding, weather_nasa
from datetime import date

router = APIRouter()

@router.post("/probabilities")
def get_weather_probabilities(request: CheckRequest):
    coords = geocoding.get_coords_from_location(request.location)
    if not coords:
        raise HTTPException(status_code=404, detail="Location not found")

    weather = weather_nasa.get_historical_weather(
        lat=coords['latitude'], 
        lon=coords['longitude'],
        event_date=request.date
    )
    
    temp_avg = weather["avg_temp_c"]
    temp_max = weather.get("max_temp_c", temp_avg + 5)
    temp_min = weather.get("min_temp_c", temp_avg - 5)
    precip = weather["avg_precipitation_mmhr"]
    wind = weather["avg_wind_speed_kmh"]
    humidity = weather["avg_humidity_percent"]
    
    def calculate_prob(value, threshold, direction="above"):
        if direction == "above":
            if value >= threshold * 1.2:
                return "High (>70%)"
            elif value >= threshold:
                return "Moderate (40-70%)"
            else:
                return "Low (<40%)"
        else:
            if value <= threshold * 0.8:
                return "High (>70%)"
            elif value <= threshold:
                return "Moderate (40-70%)"
            else:
                return "Low (<40%)"
    
    return {
        "location": request.location,
        "date": request.date,
        "activity": request.activity,
        "probabilities": {
            "very_hot": calculate_prob(temp_max, 32, "above"),
            "very_cold": calculate_prob(temp_min, 5, "below"),
            "very_wet": calculate_prob(precip, 2, "above"),
            "very_windy": calculate_prob(wind, 30, "above"),
            "uncomfortable_humidity": calculate_prob(humidity, 75, "above")
        },
        "temperature_range": {
            "average": temp_avg,
            "likely_min": temp_min,
            "likely_max": temp_max
        },
        "summary": weather
    }