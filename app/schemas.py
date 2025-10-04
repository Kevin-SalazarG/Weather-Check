from pydantic import BaseModel
from datetime import date

class CheckRequest(BaseModel):
    activity: str
    location: str
    date: date

class CheckResponse(BaseModel):
    score: int
    classification: str
    justification: str
    request_data: CheckRequest