from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderUnavailable

geolocator = Nominatim(user_agent="activity_weather_check")

def get_coords_from_location(location_name: str):
    try:
        location = geolocator.geocode(location_name)
        if location:
            return {"latitude": location.latitude, "longitude": location.longitude}
        return None
    except (GeocoderTimedOut, GeocoderUnavailable):
        return None