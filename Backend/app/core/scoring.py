from typing import List

def calculate_suitability_score(weather_data: dict, activity: str):
    weights = {
        "Hiking": {"temp": 0.30, "precip": 0.30, "wind": 0.25, "humidity": 0.10, "cloud": 0.05},
        "Cycling": {"temp": 0.20, "precip": 0.30, "wind": 0.35, "humidity": 0.10, "cloud": 0.05},
        "Picnic": {"temp": 0.15, "precip": 0.40, "wind": 0.35, "humidity": 0.05, "cloud": 0.05},
        "Running / Outdoor Sports": {"temp": 0.40, "precip": 0.15, "wind": 0.10, "humidity": 0.30, "cloud": 0.05},
        "Outdoor Market": {"temp": 0.20, "precip": 0.35, "wind": 0.40, "humidity": 0.02, "cloud": 0.03},
        "Beach": {"temp": 0.35, "precip": 0.30, "wind": 0.15, "humidity": 0.10, "cloud": 0.10},
        "Camping": {"temp": 0.25, "precip": 0.35, "wind": 0.20, "humidity": 0.10, "cloud": 0.10},
        "Festival": {"temp": 0.20, "precip": 0.40, "wind": 0.25, "humidity": 0.10, "cloud": 0.05}
    }

    temp = weather_data["avg_temp_c"]
    temp_max = weather_data.get("max_temp_c", temp + 5)
    precip = weather_data["avg_precipitation_mmhr"]
    wind = weather_data["avg_wind_speed_kmh"]
    humidity = weather_data["avg_humidity_percent"]
    cloud = weather_data["avg_cloud_cover_percent"]

    if precip > 2.5 or wind > 40 or temp_max > 40 or temp < 0:
        return 1

    def get_temp_score(t, activity_type):
        if activity_type in ["Beach", "Swimming"]:
            if 25 <= t <= 32: return 5
            if 22 <= t < 25 or 32 < t <= 35: return 4
            if 20 <= t < 22: return 3
            if 18 <= t < 20 or 35 < t <= 38: return 2
            return 1
        else:
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
        
    def get_wind_score(w, activity_type):
        if activity_type == "Cycling":
            if w < 5: return 5
            if w < 15: return 4
            if w < 25: return 3
            if w < 35: return 2
            return 1
        else:
            if w < 10: return 5
            if w < 20: return 4
            if w < 30: return 3
            if w < 40: return 2
            return 1
    
    def get_humidity_score(h, activity_type):
        if activity_type in ["Running / Outdoor Sports", "Cycling"]:
            if 30 <= h <= 50: return 5
            if 50 < h <= 60: return 4
            if 60 < h <= 70 or 20 <= h < 30: return 3
            if 70 < h <= 80: return 2
            return 1
        else:
            if 40 <= h <= 60: return 5
            if 30 <= h < 40 or 60 < h <= 70: return 4
            if 70 < h <= 80: return 3
            return 2

    scores = {
        "temp": get_temp_score(temp, activity),
        "precip": get_precip_score(precip),
        "wind": get_wind_score(wind, activity),
        "humidity": get_humidity_score(humidity, activity),
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

def get_recommendations(weather_data: dict, activity: str, probabilities: dict) -> List[str]:
    recommendations = []
    
    if probabilities["very_hot"]["probability"] > 30:
        recommendations.append("High heat risk - Bring extra water and sun protection")
    
    if probabilities["very_cold"]["probability"] > 30:
        recommendations.append("Cold weather expected - Dress in layers")
    
    if probabilities["very_wet"]["probability"] > 40:
        recommendations.append("Rain likely - Bring waterproof gear")
    
    if probabilities["very_windy"]["probability"] > 40:
        recommendations.append("Windy conditions - Secure loose items")
    
    if probabilities["uncomfortable_humidity"]["probability"] > 50:
        recommendations.append("High humidity - Plan for frequent breaks")
    
    if weather_data.get("avg_uv_index", 0) > 7:
        recommendations.append("High UV levels - Apply sunscreen frequently")
    
    if activity == "Hiking" and weather_data["avg_temp_c"] > 28:
        recommendations.append("Start early morning to avoid peak heat")
    
    if activity == "Cycling" and weather_data["avg_wind_speed_kmh"] > 20:
        recommendations.append("Strong headwinds possible - Plan route accordingly")
    
    if activity in ["Picnic", "Outdoor Market"] and weather_data["avg_cloud_cover_percent"] < 20:
        recommendations.append("Limited shade - Bring umbrellas or pop-up tents")
    
    if not recommendations:
        recommendations.append("Conditions look favorable for your activity")
    
    return recommendations[:5]

def generate_justification(weather_data: dict, activity: str, score: int) -> str:
    temp = weather_data["avg_temp_c"]
    precip = weather_data["avg_precipitation_mmhr"]
    wind = weather_data["avg_wind_speed_kmh"]
    
    if score == 5:
        return f"Excellent conditions for {activity} with comfortable temperature ({temp:.1f}°C), minimal precipitation ({precip:.1f} mm/hr), and gentle winds ({wind:.1f} km/h)."
    elif score == 4:
        return f"Good conditions for {activity}. Temperature is {temp:.1f}°C with low chance of rain ({precip:.1f} mm/hr) and moderate winds ({wind:.1f} km/h)."
    elif score == 3:
        return f"Fair conditions for {activity}. Temperature of {temp:.1f}°C may be less ideal, with some chance of precipitation ({precip:.1f} mm/hr) or wind ({wind:.1f} km/h)."
    elif score == 2:
        return f"Poor conditions for {activity}. Challenging weather with temperature at {temp:.1f}°C, precipitation risk of {precip:.1f} mm/hr, and winds at {wind:.1f} km/h."
    else:
        return f"Not recommended for {activity}. Extreme conditions detected with significant weather challenges that may pose safety concerns."