from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, func, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Program(Base):
    __tablename__ = "programs"

    program_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text)
    benefits = Column(Text)
    duration = Column(String(100))
    application_deadline = Column(TIMESTAMP)
    is_active = Column(Integer, default=1)  # 1 for active, 0 for inactive
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relationships
    creator = relationship("User", back_populates="created_programs")
    applications = relationship("Application", back_populates="program")