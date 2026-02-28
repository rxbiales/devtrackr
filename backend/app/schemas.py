from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# --- SHARED CONFIG ---
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True # Allows Pydantic to read SQLAlchemy models

# --- INTERVIEW SCHEMAS ---
class InterviewBase(BaseModel):
    interview_date: datetime
    notes: Optional[str] = None
    interview_type: Optional[str] = "Technical" # e.g., HR, Technical, Cultural

class InterviewCreate(InterviewBase):
    job_id: int # Required to link the interview to a job 

class Interview(InterviewBase, BaseSchema):
    id: int

# --- CURRICULUM SCHEMAS ---
class CurriculumBase(BaseModel):
    name: str
    file_path: str # Path to the stored PDF file 

class CurriculumCreate(CurriculumBase):
    pass

class Curriculum(CurriculumBase, BaseSchema):
    id: int
    upload_date: datetime

# --- JOB SCHEMAS ---
class JobBase(BaseModel):
    job_title: str
    company: str
    platform: Optional[str] = None
    work_mode: Optional[str] = None
    status: Optional[str] = "applied"
    is_active: bool = True  # 👈 ADICIONADO AQUI [cite: 2026-02-28]

class JobCreate(JobBase):
    curriculum_id: Optional[int] = None

class Job(JobBase, BaseSchema):
    id: int
    applied_date: datetime
    is_active: bool # 👈 ADICIONADO AQUI TAMBÉM [cite: 2026-02-28]
    interviews: List[Interview] = []