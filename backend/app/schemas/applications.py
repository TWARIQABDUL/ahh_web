from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..models.enums import ApplicationStatus

class ApplicationCreate(BaseModel):
    venture_id: int
    program_id: Optional[int] = None

    class Config:
        json_schema_extra = {
            "example": {
                "venture_id": 1,
                "program_id": 1
            }
        }

class ApplicationResponse(BaseModel):
    application_id: int
    venture_id: int
    program_id: Optional[int]
    status: ApplicationStatus
    submission_date: datetime
    reviewed_by: Optional[int]
    reviewed_at: Optional[datetime]

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "application_id": 1,
                "venture_id": 1,
                "program_id": 1,
                "status": "submitted",
                "submission_date": "2023-01-01T00:00:00Z",
                "reviewed_by": None,
                "reviewed_at": None
            }
        }

class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None