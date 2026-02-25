from fastapi import FastAPI
from app.database import engine, Base
from app import models
# Create all tables in the SQLite database if they don't exist
models.Base.metadata.create_all(bind=engine)

# Initialize the FastAPI application
app = FastAPI()

# Root endpoint to check system status
@app.get("/")
def home():
    return {"status": "DevTrackr Online", "database": "Connected"}