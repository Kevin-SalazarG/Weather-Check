from fastapi import APIRouter, HTTPException
from app.schemas import LocationComparisonRequest, ComparisonResponse, LocationData
from app.services import geocoding, weather_nasa
from app.core import scoring
from typing import List

router = APIRouter()

@router.post("/compare", response_model=ComparisonResponse)
def compare_locations(request: LocationComparisonRequest):
    comparison_data: List[LocationData] = []
    
    for location in request.locations:
        coords = geocoding.get_coords_from_location(location)
        if not coords:
            continue
        
        weather = weather_nasa.get_historical_weather(
            lat=coords['latitude'],
            lon=coords['longitude'],
            event_date=request.date
        )
        
        probabilities = weather_nasa.calculate_extreme_probabilities(weather)
        
        score = scoring.calculate_suitability_score(
            weather_data=weather,
            activity=request.activity
        )
        
        comparison_data.append(LocationData(
            location=location,
            score=score,
            weather_data=weather,
            probabilities=probabilities
        ))
    
    if not comparison_data:
        raise HTTPException(status_code=404, detail="No valid locations found")
    
    best_location = max(comparison_data, key=lambda x: x.score).location
    
    return ComparisonResponse(
        best_location=best_location,
        comparison_data=sorted(comparison_data, key=lambda x: x.score, reverse=True),
        activity=request.activity,
        date=request.date
    )