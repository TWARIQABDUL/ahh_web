from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProgramCreate(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    duration: Optional[str] = None
    application_deadline: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Healthcare Innovation Accelerator",
                "description": "A 6-month program for early-stage healthcare startups",
                "requirements": "Must have a healthcare-focused venture with initial prototype",
                "benefits": "Mentorship, funding opportunities, and networking events",
                "duration": "6 months",
                "application_deadline": "2024-12-31T23:59:59Z"
            }
        }

class ProgramUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    duration: Optional[str] = None
    application_deadline: Optional[datetime] = None
    is_active: Optional[int] = None

class ProgramResponse(BaseModel):
    program_id: int
    title: str
    description: str
    requirements: Optional[str]
    benefits: Optional[str]
    duration: Optional[str]
    application_deadline: Optional[datetime]
    is_active: int
    created_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True