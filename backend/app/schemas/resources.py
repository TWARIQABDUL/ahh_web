from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ResourceCategoryCreate(BaseModel):
    category_name: str

    class Config:
        json_schema_extra = {
            "example": {
                "category_name": "Funding Resources"
            }
        }

class ResourceCategoryResponse(BaseModel):
    category_id: int
    category_name: str

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "category_id": 1,
                "category_name": "Funding Resources"
            }
        }

class ResourceCreate(BaseModel):
    category_id: int
    title: str
    description: Optional[str] = None
    url: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "category_id": 1,
                "title": "Startup Funding Guide",
                "description": "Comprehensive guide to funding options for startups",
                "url": "https://example.com/funding-guide"
            }
        }

class ResourceResponse(BaseModel):
    resource_id: int
    category_id: int
    uploaded_by_id: int
    title: str
    description: Optional[str]
    url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "resource_id": 1,
                "category_id": 1,
                "uploaded_by_id": 1,
                "title": "Startup Funding Guide",
                "description": "Comprehensive guide to funding options for startups",
                "url": "https://example.com/funding-guide",
                "created_at": "2023-01-01T00:00:00Z"
            }
        }

class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None