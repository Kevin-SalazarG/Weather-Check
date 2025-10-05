from fastapi import APIRouter, HTTPException
from app.schemas import CheckRequest, ExtremeProbabilities
from app.services import geocoding, weather_nasa

router = APIRouter()

@router.post("/probabilities", response_model=ExtremeProbabilities)
def get_weather_probabilities(request: CheckRequest):
    coords = geocoding.get_coords_from_location(request.location)
    if not coords:
        raise HTTPException(status_code=404, detail="Location not found")

    weather = weather_nasa.get_historical_weather(
        lat=coords['latitude'], 
        lon=coords['longitude'],
        event_date=request.date
    )
    
    probabilities = weather_nasa.calculate_extreme_probabilities(weather)
    
    return probabilities