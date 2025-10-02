from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..models.enums import UserRole

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role: UserRole
    profile_details: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "password": "securePassword123",
                "role": "Member",
                "profile_details": "Experienced entrepreneur in healthcare"
            }
        }

class UserLogin(BaseModel):
    email: str
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "john.doe@example.com",
                "password": "securePassword123"
            }
        }

class UserResponse(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    email: str
    role: UserRole
    is_approved: bool
    profile_details: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "role": "Member",
                "is_approved": True,
                "profile_details": "Experienced entrepreneur in healthcare",
                "created_at": "2023-01-01T00:00:00Z"
            }
        }

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    profile_details: Optional[str] = None