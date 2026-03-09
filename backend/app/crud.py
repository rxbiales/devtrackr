from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash

# --- USUÁRIOS ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pwd = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_pwd)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- VAGAS  ---
def get_jobs(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Job).filter(models.Job.owner_id == user_id).offset(skip).limit(limit).all()

def create_job(db: Session, job: schemas.JobCreate, user_id: int):
    db_job = models.Job(**job.model_dump(), owner_id=user_id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def update_job(db: Session, job_id: int, job_update: schemas.JobUpdate, user_id: int):
    db_job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.owner_id == user_id).first()
    if db_job:
        update_data = job_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_job, key, value)
        db.commit()
        db.refresh(db_job)
    return db_job

def delete_job(db: Session, job_id: int, user_id: int):
    db_job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.owner_id == user_id).first()
    if db_job:
        db.delete(db_job)
        db.commit()
        return True
    return False

# --- CURRÍCULOS ---
def get_curriculums(db: Session):
    return db.query(models.Curriculum).all()

def create_curriculum(db: Session, name: str, file_path: str, version: str = None):
    db_cv = models.Curriculum(name=name, file_path=file_path, version=version)
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    return db_cv

# --- PROCESSOS (ENTREVISTAS E DESAFIOS) ---
def create_interview(db: Session, interview: schemas.InterviewCreate):
    db_int = models.Interview(**interview.model_dump())
    db.add(db_int)
    db.commit()
    db.refresh(db_int)
    return db_int

def create_challenge(db: Session, challenge: schemas.TechnicalChallengeCreate):
    db_ch = models.TechnicalChallenge(**challenge.model_dump())
    db.add(db_ch)
    db.commit()
    db.refresh(db_ch)
    return db_ch