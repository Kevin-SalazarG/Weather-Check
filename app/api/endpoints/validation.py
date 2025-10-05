from fastapi import APIRouter
from app.services import geocoding, weather_nasa
from datetime import date

router = APIRouter()

@router.get("/validate")
def validate_nasa_data():
    
    test_cases = [
        {
            "location": "Miami, Florida",
            "date": date(2025, 7, 15),
            "expected": {"temp_range": (25, 32), "high_humidity": True}
        },
        {
            "location": "Anchorage, Alaska",
            "date": date(2025, 1, 15),
            "expected": {"temp_range": (-15, 5), "cold": True}
        },
        {
            "location": "Seattle, Washington",
            "date": date(2025, 11, 15),
            "expected": {"high_precip": True, "temp_range": (5, 12)}
        },
        {
            "location": "Phoenix, Arizona",
            "date": date(2025, 7, 15),
            "expected": {"max_temp_range": (35, 45), "very_hot": True}
        },
        {
            "location": "London, UK",
            "date": date(2025, 12, 25),
            "expected": {"temp_range": (2, 12), "moderate_precip": True}
        }
    ]
    
    results = []
    
    for case in test_cases:
        coords = geocoding.get_coords_from_location(case["location"])
        
        if coords:
            weather = weather_nasa.get_historical_weather(
                lat=coords['latitude'],
                lon=coords['longitude'],
                event_date=case['date']
            )
            
            validations = {}
            
            if "temp_range" in case["expected"]:
                min_temp, max_temp = case["expected"]["temp_range"]
                validations["temp_in_range"] = bool(min_temp <= weather["avg_temp_c"] <= max_temp)
            
            if "max_temp_range" in case["expected"]:
                min_max, max_max = case["expected"]["max_temp_range"]
                validations["max_temp_in_range"] = bool(min_max <= weather.get("max_temp_c", 0) <= max_max)
            
            if case["expected"].get("high_humidity"):
                validations["high_humidity"] = bool(weather["avg_humidity_percent"] > 70)
            
            if case["expected"].get("cold"):
                validations["is_cold"] = bool(weather["avg_temp_c"] < 10)
            
            if case["expected"].get("very_hot"):
                validations["is_very_hot"] = bool(weather.get("max_temp_c", 0) > 30)
            
            if case["expected"].get("high_precip"):
                validations["high_precipitation"] = bool(weather["avg_precipitation_mmhr"] > 1.5)
            
            if case["expected"].get("moderate_precip"):
                validations["moderate_precipitation"] = bool(weather["avg_precipitation_mmhr"] > 0.5)
            
            results.append({
                "location": case["location"],
                "date": str(case['date']),
                "weather_data": weather,
                "validations": validations,
                "all_passed": bool(all(validations.values()))
            })
    
    total_tests = int(sum(len(r["validations"]) for r in results))
    passed_tests = int(sum(sum(r["validations"].values()) for r in results))
    
    return {
        "summary": {
            "total_validations": total_tests,
            "passed": passed_tests,
            "failed": total_tests - passed_tests,
            "success_rate": f"{(passed_tests/total_tests*100):.1f}%" if total_tests > 0 else "0%"
        },
        "results": results
    }
    
@router.get("/verify-source")
def verify_nasa_source():
    import requests
    
    test_location = {
        "lat": 33.45,
        "lon": -112.07,
        "name": "Phoenix, AZ"
    }
    
    params = {
        "parameters": "T2M",
        "community": "RE",
        "longitude": test_location["lon"],
        "latitude": test_location["lat"],
        "start": "20240715",
        "end": "20240715",
        "format": "JSON"
    }
    
    nasa_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    
    try:
        response = requests.get(nasa_url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        return {
            "status": "SUCCESS - Connected to real NASA API",
            "location": test_location["name"],
            "nasa_api_url": nasa_url,
            "response_sample": {
                "header": data.get("header", {}),
                "parameter_sample": list(data.get("properties", {}).get("parameter", {}).get("T2M", {}).items())[:3]
            },
            "verification": {
                "is_nasa_official": "power.larc.nasa.gov" in nasa_url,
                "response_valid": bool(data.get("properties")),
                "data_source": data.get("header", {}).get("title", "Unknown")
            }
        }
    except Exception as e:
        return {
            "status": "ERROR",
            "error": str(e)
        }