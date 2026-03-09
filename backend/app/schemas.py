from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

class CurriculumBase(BaseModel):
    name: str
    file_path: str 
    version: Optional[str] = None

class CurriculumCreate(CurriculumBase):
    pass

class Curriculum(CurriculumBase, BaseSchema):
    id: int
    created_at: datetime

class InterviewBase(BaseModel):
    interview_date: datetime
    notes: Optional[str] = None
    location: Optional[str] = None 

class InterviewCreate(InterviewBase):
    job_id: int 

class Interview(InterviewBase, BaseSchema):
    id: int

class TechnicalChallengeBase(BaseModel):
    job_id: int
    challenge_deadline: datetime  
    location: Optional[str] = None
    notes: Optional[str] = None

class TechnicalChallengeCreate(TechnicalChallengeBase):
    pass

class TechnicalChallenge(TechnicalChallengeBase, BaseSchema):
    id: int

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
    applied_date: datetime

class JobUpdate(BaseModel):
    status: Optional[str] = None
    is_active: Optional[bool] = None

class Job(JobBase, BaseSchema): 
    id: int
    applied_date: datetime
    curriculum_id: Optional[int] = None
    interviews: List[Interview] = [] 
    challenges: List[TechnicalChallenge] = []

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase, BaseSchema):
    id: int
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None