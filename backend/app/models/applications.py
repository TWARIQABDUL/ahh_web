from sqlalchemy import Column, Integer, TIMESTAMP, func, ForeignKey, Enum
from sqlalchemy.orm import relationship
from ..database import Base
from .enums import ApplicationStatus

class Application(Base):
    __tablename__ = "applications"

    application_id = Column(Integer, primary_key=True)
    venture_id = Column(Integer, ForeignKey("ventures.venture_id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(ApplicationStatus, values_callable=lambda x: [e.value for e in x]), default=ApplicationStatus.SUBMITTED)
    submission_date = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    venture = relationship("Venture", back_populates="applications")