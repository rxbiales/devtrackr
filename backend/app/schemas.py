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

class JobCreate(JobBase):
    curriculum_id: Optional[int] = None # Optional link to a CV 

class Job(JobBase, BaseSchema):
    id: int
    applied_date: datetime
    interviews: List[Interview] = [] # Shows all interviews linked to this job 