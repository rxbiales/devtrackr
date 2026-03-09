import os
import shutil
from datetime import timedelta
from typing import List

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import models, schemas, crud, auth
from .database import engine
from .dependencies import get_db

# Cria as tabelas no banco de dados
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="DevTrackr API")

# Configuração de Uploads
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Middlewares (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AUTH & USER ROUTES ---

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    return crud.create_user(db=db, user=user)

@app.post("/token/", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Email ou senha incorretos"
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- JOB ROUTES ---

@app.get("/jobs/", response_model=List[schemas.Job])
def read_jobs(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Job).filter(models.Job.owner_id == current_user.id).all()

@app.post("/jobs/", response_model=schemas.Job)
def create_job(
    job: schemas.JobCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_job(db=db, job=job, user_id=current_user.id)

@app.delete("/jobs/{job_id}")
def delete_job(
    job_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.owner_id == current_user.id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found or unauthorized")
    
    db.delete(db_job)
    db.commit()
    return {"message": "Success"}

@app.patch("/jobs/{job_id}", response_model=schemas.Job)
def update_job(
    job_id: int, 
    job_update: schemas.JobUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_job = crud.update_job(db=db, job_id=job_id, job_update=job_update, user_id=current_user.id)
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found or unauthorized")
    return db_job

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
    
    file_url = f"http://localhost:8000/uploads/{file.filename}"
    return crud.create_curriculum(db, name=name, file_path=file_url, version=version)

# --- PROCESS ROUTES ---

@app.post("/challenges/", response_model=schemas.TechnicalChallenge)
def create_challenge(challenge: schemas.TechnicalChallengeCreate, db: Session = Depends(get_db)):
    return crud.create_challenge(db=db, challenge=challenge)

@app.post("/interviews/", response_model=schemas.Interview)
def create_interview(interview: schemas.InterviewCreate, db: Session = Depends(get_db)):
    return crud.create_interview(db=db, interview=interview)