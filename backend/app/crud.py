from sqlalchemy.orm import Session
from . import models, schemas

# --- JOB OPERATIONS ---

def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Job).offset(skip).limit(limit).all()

def create_job(db: Session, job: schemas.JobCreate):
    db_job = models.Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def delete_job(db: Session, job_id: int):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if db_job:
        db.delete(db_job)
        db.commit()
    return db_job

# --- CURRICULUM OPERATIONS ---

def create_curriculum(db: Session, curriculum: schemas.CurriculumCreate):
    db_curriculum = models.Curriculum(**curriculum.model_dump())
    db.add(db_curriculum)
    db.commit()
    db.refresh(db_curriculum)
    return db_curriculum

# --- INTERVIEW OPERATIONS ---

def create_interview(db: Session, interview: schemas.InterviewCreate):
    db_interview = models.Interview(**interview.model_dump())
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview