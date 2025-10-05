from pydantic import BaseModel
from datetime import date
from typing import Optional, Dict

class CheckRequest(BaseModel):
    activity: str
    location: str
    date: date

class CheckResponse(BaseModel):
    score: int
    classification: str
    justification: str
    weather_data: Optional[Dict] = None
    request_data: CheckRequest