from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    applied_date = Column(DateTime, nullable=False)    
    platform = Column(String) 
    work_mode = Column(String) 
    status = Column(String, default="applied")
    role = Column(String, nullable=True)
    
    curriculum_id = Column(Integer, ForeignKey("curriculums.id"), nullable=True)

    # RELACIONAMENTOS (O Job é o dono de tudo)
    interviews = relationship("Interview", back_populates="job")
    challenges = relationship("TechnicalChallenge", back_populates="job")
    curriculum = relationship("Curriculum", back_populates="jobs")

class Curriculum(Base):
    __tablename__ = "curriculums"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    version = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    
    # O currículo só conhece as vagas onde foi usado
    jobs = relationship("Job", back_populates="curriculum")

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    interview_date = Column(DateTime, nullable=False)
    location = Column(String)
    notes = Column(String)

    job = relationship("Job", back_populates="interviews")

class TechnicalChallenge(Base):
    __tablename__ = "technical_challenges"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    challenge_deadline = Column(DateTime, nullable=False)
    location = Column(String)
    notes = Column(String)
    
    job = relationship("Job", back_populates="challenges")