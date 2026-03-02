from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, crud
from .database import engine
from .dependencies import get_db

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="DevTrackr API")

# --- CORS MIDDLEWARE ---
# Allows your frontend (React/Next.js) to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTES ---

@app.get("/")
def home():
    return {"status": "DevTrackr Online", "database": "Connected"}

@app.get("/jobs/", response_model=List[schemas.Job])
def read_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_jobs(db, skip=skip, limit=limit)

@app.post("/jobs/", response_model=schemas.Job)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    return crud.create_job(db=db, job=job)

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    success = crud.delete_job(db=db, job_id=job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": f"Job {job_id} deleted successfully"}

@app.patch("/jobs/{job_id}/status")
def update_job_status(job_id: int, data: dict, db: Session = Depends(get_db)):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db_job.status = data.get("status")
    db.commit()
    db.refresh(db_job)
    return db_job

@app.patch("/jobs/{job_id}/deactivate")
def deactivate_job(job_id: int, db: Session = Depends(get_db)):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db_job.is_active = False
    db.commit()
    return {"message": "Job deactivated"}