from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, func, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Venture(Base):
    __tablename__ = "ventures"

    venture_id = Column(Integer, primary_key=True)
    member_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    venture_name = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    member = relationship("User", back_populates="ventures")
    applications = relationship("Application", back_populates="venture")
    milestones = relationship("Milestone", back_populates="venture")