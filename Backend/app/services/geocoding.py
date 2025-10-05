from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderUnavailable
import time

geolocator = Nominatim(user_agent="will_it_rain_on_my_parade_v1")

def get_coords_from_location(location_name: str):
    max_retries = 3
    retry_delay = 1
    
    for attempt in range(max_retries):
        try:
            location = geolocator.geocode(
                location_name,
                exactly_one=True,
                timeout=10,
                language="en"
            )
            
            if location:
                return {
                    "latitude": location.latitude,
                    "longitude": location.longitude,
                    "display_name": location.address
                }
            
            return None
            
        except GeocoderTimedOut:
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
                retry_delay *= 2
                continue
            return None
            
        except GeocoderUnavailable:
            return None
            
        except Exception as e:
            print(f"Geocoding error: {e}")
            return None
    
    return None