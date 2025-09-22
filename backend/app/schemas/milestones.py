from pydantic import BaseModel
from datetime import date
from typing import Optional
from ..models.enums import MilestoneStatus

class MilestoneCreate(BaseModel):
    venture_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None

    class Config:
        json_schema_extra = {
            "example": {
                "venture_id": 1,
                "title": "Complete MVP",
                "description": "Develop and test the minimum viable product",
                "due_date": "2023-06-01"
            }
        }

class MilestoneResponse(BaseModel):
    milestone_id: int
    venture_id: int
    title: str
    description: Optional[str]
    status: MilestoneStatus
    due_date: Optional[date]

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "milestone_id": 1,
                "venture_id": 1,
                "title": "Complete MVP",
                "description": "Develop and test the minimum viable product",
                "status": "in_progress",
                "due_date": "2023-06-01"
            }
        }

class MilestoneUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[MilestoneStatus] = None
    due_date: Optional[date] = None