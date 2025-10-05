from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import check, probabilities, export

app = FastAPI(
    title="Will It Rain On My Parade API",
    description="Weather suitability checker using NASA data",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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