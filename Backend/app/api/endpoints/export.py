from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.schemas import CheckRequest
from app.services import geocoding, weather_nasa
import csv
import json
from io import StringIO

router = APIRouter()

@router.post("/export/csv")
def export_csv(request: CheckRequest):
    coords = geocoding.get_coords_from_location(request.location)
    if not coords:
        raise HTTPException(status_code=404, detail="Location not found")

    weather = weather_nasa.get_historical_weather(
        lat=coords['latitude'], 
        lon=coords['longitude'],
        event_date=request.date
    )
    
    output = StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["Metric", "Value", "Unit"])
    writer.writerow(["Location", request.location, ""])
    writer.writerow(["Date", request.date, ""])
    writer.writerow(["Activity", request.activity, ""])
    writer.writerow(["Average Temperature", weather["avg_temp_c"], "°C"])
    writer.writerow(["Max Temperature", weather.get("max_temp_c", "N/A"), "°C"])
    writer.writerow(["Min Temperature", weather.get("min_temp_c", "N/A"), "°C"])
    writer.writerow(["Precipitation", weather["avg_precipitation_mmhr"], "mm/hr"])
    writer.writerow(["Wind Speed", weather["avg_wind_speed_kmh"], "km/h"])
    writer.writerow(["Humidity", weather["avg_humidity_percent"], "%"])
    writer.writerow(["Data Source", weather["data_source"], ""])
    writer.writerow(["Years Analyzed", weather["years_analyzed"], ""])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=weather_{request.location}_{request.date}.csv"}
    )

@router.post("/export/json")
def export_json(request: CheckRequest):
    coords = geocoding.get_coords_from_location(request.location)
    if not coords:
        raise HTTPException(status_code=404, detail="Location not found")

    weather = weather_nasa.get_historical_weather(
        lat=coords['latitude'], 
        lon=coords['longitude'],
        event_date=request.date
    )
    
    export_data = {
        "metadata": {
            "location": request.location,
            "coordinates": coords,
            "date": str(request.date),
            "activity": request.activity
        },
        "weather_data": weather
    }
    
    return StreamingResponse(
        iter([json.dumps(export_data, indent=2)]),
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=weather_{request.location}_{request.date}.json"}
    )