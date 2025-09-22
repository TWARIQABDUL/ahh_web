from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..models.enums import MatchStatus

class MentorMatchCreate(BaseModel):
    mentor_id: int
    member_id: int

    class Config:
        json_schema_extra = {
            "example": {
                "mentor_id": 1,
                "member_id": 2
            }
        }

class MentorMatchResponse(BaseModel):
    match_id: int
    mentor_id: int
    member_id: int
    status: MatchStatus
    created_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "match_id": 1,
                "mentor_id": 1,
                "member_id": 2,
                "status": "pending",
                "created_at": "2023-01-01T00:00:00Z"
            }
        }

class MentorMatchUpdate(BaseModel):
    status: Optional[MatchStatus] = None