def calculate_suitability_score(weather_data: dict, activity: str):
    
    weights = {
        "Hiking": {"temp": 0.30, "precip": 0.30, "wind": 0.25, "humidity": 0.10, "cloud": 0.05},
        "Cycling": {"temp": 0.20, "precip": 0.30, "wind": 0.35, "humidity": 0.10, "cloud": 0.05},
        "Picnic": {"temp": 0.15, "precip": 0.40, "wind": 0.35, "humidity": 0.05, "cloud": 0.05},
        "Running / Outdoor Sports": {"temp": 0.40, "precip": 0.15, "wind": 0.10, "humidity": 0.30, "cloud": 0.05},
        "Outdoor Market": {"temp": 0.20, "precip": 0.35, "wind": 0.40, "humidity": 0.02, "cloud": 0.03}
    }

    temp = weather_data["avg_temp_c"]
    precip = weather_data["avg_precipitation_mmhr"]
    wind = weather_data["avg_wind_speed_kmh"]
    humidity = weather_data["avg_humidity_percent"]
    cloud = weather_data["avg_cloud_cover_percent"]

    if precip > 2.5 or wind > 40 or temp < 5 or temp > 35:
        return 1

    def get_temp_score(t):
        if 18 <= t <= 24: return 5
        if 12 <= t < 18 or 24 < t <= 28: return 4
        if 8 <= t < 12 or 28 < t <= 32: return 3
        if 5 <= t < 8 or 32 < t <= 35: return 2
        return 1

    def get_precip_score(p):
        if p == 0: return 5
        if p <= 0.5: return 4
        if p <= 1.5: return 3
        if p <= 2.5: return 2
        return 1
        
    def get_wind_score(w):
        if w < 10: return 5
        if w < 20: return 4
        if w < 30: return 3
        if w < 40: return 2
        return 1

    scores = {
        "temp": get_temp_score(temp),
        "precip": get_precip_score(precip),
        "wind": get_wind_score(wind),
        "humidity": 5 if 40 <= humidity <= 60 else 3,
        "cloud": 5 if 20 <= cloud <= 50 else 3
    }
    
    activity_weights = weights.get(activity, weights["Hiking"])
    
    final_score = (
        scores["temp"] * activity_weights["temp"] +
        scores["precip"] * activity_weights["precip"] +
        scores["wind"] * activity_weights["wind"] +
        scores["humidity"] * activity_weights["humidity"] +
        scores["cloud"] * activity_weights["cloud"]
    )
    
    return round(final_score)