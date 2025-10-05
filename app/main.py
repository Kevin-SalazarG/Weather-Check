from fastapi import FastAPI
from app.api.endpoints import check, probabilities, export

app = FastAPI(
    title="Will It Rain On My Parade API",
    description="Weather suitability checker using NASA data",
    version="1.0.0"
)

app.include_router(check.router, prefix="/api")
app.include_router(probabilities.router, prefix="/api")
app.include_router(export.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "API is running",
        "endpoints": [
            "/api/check - Check weather suitability",
            "/api/probabilities - Get weather probabilities",
            "/api/export/csv - Export data as CSV",
            "/api/export/json - Export data as JSON",
            "/docs - API documentation"
        ]
    }