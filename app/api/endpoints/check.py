from fastapi import APIRouter, HTTPException
from app.schemas import CheckRequest, CheckResponse
from app.services import geocoding, weather_nasa
from app.core import scoring

router = APIRouter()

@router.post("/check", response_model=CheckResponse)
def check_weather_suitability(request: CheckRequest):
    
    coords = geocoding.get_coords_from_location(request.location)
    if not coords:
        raise HTTPException(status_code=404, detail="Location not found or geocoding service unavailable.")

    historical_weather = weather_nasa.get_historical_weather(
        lat=coords['latitude'], 
        lon=coords['longitude'],
        event_date=request.date
    )

    final_score = scoring.calculate_suitability_score(
        weather_data=historical_weather,
        activity=request.activity
    )

    classifications = {1: "Not Recommended", 2: "Poor", 3: "Fair", 4: "Good", 5: "Excellent"}
    classification_text = classifications.get(final_score, "Unknown")
    justification_text = f"The score was calculated based on historical weather averages for the selected date."

    return CheckResponse(
        score=final_score,
        classification=classification_text,
        justification=justification_text,
        request_data=request
    )