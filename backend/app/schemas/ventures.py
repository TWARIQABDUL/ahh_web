from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .user import UserResponse

class VentureCreate(BaseModel):
    venture_name: str
    description: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "venture_name": "HealthTech Startup",
                "description": "A startup focused on telemedicine solutions"
            }
        }

class VentureResponse(BaseModel):
    venture_id: int
    member_id: int
    venture_name: str
    description: Optional[str]
    created_at: datetime
    member: Optional[UserResponse] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "venture_id": 1,
                "member_id": 1,
                "venture_name": "HealthTech Startup",
                "description": "A startup focused on telemedicine solutions",
                "created_at": "2023-01-01T00:00:00Z",
                "member": {
                    "user_id": 1,
                    "first_name": "John",
                    "last_name": "Doe",
                    "email": "john.doe@example.com",
                    "role": "Member",
                    "profile_details": "Experienced entrepreneur",
                    "created_at": "2023-01-01T00:00:00Z"
                }
            }
        }

class VentureUpdate(BaseModel):
    venture_name: Optional[str] = None
    description: Optional[str] = None