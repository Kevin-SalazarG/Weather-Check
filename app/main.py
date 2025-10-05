from fastapi import FastAPI
from app.api.endpoints import check, validation

app = FastAPI(title="Activity Weather Check API")

app.include_router(check.router, prefix="/api")
app.include_router(validation.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "API is running"}