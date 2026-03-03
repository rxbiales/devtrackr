import os
import shutil
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, crud
from .database import engine, SessionLocal
from .dependencies import get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="DevTrackr API")

# Configuração de Arquivos Estáticos (Uploads)
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- JOB ROUTES ---
@app.get("/jobs/", response_model=List[schemas.Job])
def read_jobs(db: Session = Depends(get_db)):
    return crud.get_jobs(db)

@app.post("/jobs/", response_model=schemas.Job)
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    return crud.create_job(db=db, job=job)

@app.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    if not crud.delete_job(db, job_id):
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Success"}

# --- CURRICULUM ROUTES ---
@app.get("/curriculums/", response_model=List[schemas.Curriculum])
def read_curriculums(db: Session = Depends(get_db)):
    return crud.get_curriculums(db)

@app.post("/curriculums/upload", response_model=schemas.Curriculum)
async def upload_curriculum(
    name: str = Form(...),
    version: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # URL completa para o frontend ler o PDF
    file_url = f"http://localhost:8000/uploads/{file.filename}"
    return crud.create_curriculum(db, name=name, file_path=file_url, version=version)

# --- PROCESS ROUTES ---
@app.post("/challenges/", response_model=schemas.TechnicalChallenge)
def create_challenge(challenge: schemas.TechnicalChallengeCreate, db: Session = Depends(get_db)):
    return crud.create_challenge(db=db, challenge=challenge)

@app.post("/interviews/", response_model=schemas.Interview)
def create_interview(interview: schemas.InterviewCreate, db: Session = Depends(get_db)):
    return crud.create_interview(db=db, interview=interview)