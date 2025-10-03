from sqlalchemy import Column, Integer, TIMESTAMP, func, ForeignKey, Enum
from sqlalchemy.orm import relationship
from ..database import Base
from .enums import ApplicationStatus

class Application(Base):
    __tablename__ = "applications"

    application_id = Column(Integer, primary_key=True)
    venture_id = Column(Integer, ForeignKey("ventures.venture_id", ondelete="CASCADE"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.program_id", ondelete="CASCADE"), nullable=True)
    status = Column(Enum(ApplicationStatus, values_callable=lambda x: [e.value for e in x]), default=ApplicationStatus.SUBMITTED)
    submission_date = Column(TIMESTAMP, server_default=func.now())
    reviewed_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    reviewed_at = Column(TIMESTAMP, nullable=True)

    # Relationships
    venture = relationship("Venture", back_populates="applications")
    program = relationship("Program", back_populates="applications")
    reviewer = relationship("User")