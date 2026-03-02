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
    is_active: bool = True
    role: Optional[str] = None 

class JobCreate(JobBase):
    curriculum_id: Optional[int] = None
    applied_date: Optional[datetime] = None

class Job(JobBase): 
    id: int
    applied_date: Optional[datetime] = None 
    is_active: bool
    interviews: List["Interview"] = [] 

    class Config:
        from_attributes = True