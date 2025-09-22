from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    receiver_id: int
    content: str

    class Config:
        json_schema_extra = {
            "example": {
                "receiver_id": 2,
                "content": "Hello, I'd like to discuss your venture idea."
            }
        }

class MessageResponse(BaseModel):
    message_id: int
    sender_id: int
    receiver_id: int
    content: str
    sent_at: datetime
    is_read: bool

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "message_id": 1,
                "sender_id": 1,
                "receiver_id": 2,
                "content": "Hello, I'd like to discuss your venture idea.",
                "sent_at": "2023-01-01T00:00:00Z",
                "is_read": False
            }
        }

class MessageUpdate(BaseModel):
    is_read: Optional[bool] = None