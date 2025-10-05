from fastapi import APIRouter, HTTPException
from app.schemas import ClimateTrendsResponse
from app.services import geocoding, weather_nasa

router = APIRouter()

@router.get("/trends/{location}", response_model=ClimateTrendsResponse)
def get_climate_trends(location: str, start_year: int = 2014, end_year: int = 2023):
    coords = geocoding.get_coords_from_location(location)
    if not coords:
        raise HTTPException(status_code=404, detail="Location not found")
    
    trends = weather_nasa.get_climate_trends(
        lat=coords['latitude'],
        lon=coords['longitude'],
        location=location,
        start_year=start_year,
        end_year=end_year
    )
    
    return trends