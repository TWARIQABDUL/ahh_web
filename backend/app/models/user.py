from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, func, Enum
from sqlalchemy.orm import relationship
from ..database import Base
from .enums import UserRole

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole, values_callable=lambda x: [e.value for e in x]), nullable=False)
    profile_details = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    ventures = relationship("Venture", back_populates="member")
    resources = relationship("Resource", back_populates="uploaded_by")
    mentor_matches_as_mentor = relationship("MentorMatch", foreign_keys="MentorMatch.mentor_id", back_populates="mentor")
    mentor_matches_as_member = relationship("MentorMatch", foreign_keys="MentorMatch.member_id", back_populates="member")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")