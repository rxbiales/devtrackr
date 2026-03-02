from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# --- SHARED CONFIG ---
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# --- INTERVIEW SCHEMAS ---
class InterviewBase(BaseModel):
    interview_date: datetime
    notes: Optional[str] = None
    location: Optional[str] = None 

class InterviewCreate(InterviewBase):
    job_id: int 

class Interview(InterviewBase, BaseSchema):
    id: int

# --- TECHNICAL CHALLENGE SCHEMAS ---

# No app/schemas.py

class TechnicalChallengeBase(BaseModel):
    job_id: int
    challenge_deadline: datetime  
    location: Optional[str] = None
    notes: Optional[str] = None

class TechnicalChallengeCreate(TechnicalChallengeBase):
    pass

class TechnicalChallenge(TechnicalChallengeBase, BaseSchema):
    id: int

# --- CURRICULUM SCHEMAS ---
class CurriculumBase(BaseModel):
    name: str
    file_path: str 

class CurriculumCreate(CurriculumBase):
    pass

class Curriculum(CurriculumBase, BaseSchema):
    id: int
    created_at: datetime

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
    applied_date: datetime # Removido Optional para bater com o model

class Job(JobBase, BaseSchema): 
    id: int
    applied_date: datetime
    curriculum_id: Optional[int] = None
    interviews: List[Interview] = [] 
    challenges: List[TechnicalChallenge] = [] # Agora ele reconhece a classe acima