from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..models.enums import ApplicationStatus

class ApplicationCreate(BaseModel):
    venture_id: int

    class Config:
        json_schema_extra = {
            "example": {
                "venture_id": 1
            }
        }

class ApplicationResponse(BaseModel):
    application_id: int
    venture_id: int
    status: ApplicationStatus
    submission_date: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "application_id": 1,
                "venture_id": 1,
                "status": "submitted",
                "submission_date": "2023-01-01T00:00:00Z"
            }
        }

class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None