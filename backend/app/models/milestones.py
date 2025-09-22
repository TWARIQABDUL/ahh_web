from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, DATE, func, ForeignKey, Enum
from sqlalchemy.orm import relationship
from ..database import Base
from .enums import MilestoneStatus

class Milestone(Base):
    __tablename__ = "milestones"

    milestone_id = Column(Integer, primary_key=True)
    venture_id = Column(Integer, ForeignKey("ventures.venture_id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(Enum(MilestoneStatus, values_callable=lambda x: [e.value for e in x]), default=MilestoneStatus.NOT_STARTED)
    due_date = Column(DATE)

    # Relationships
    venture = relationship("Venture", back_populates="milestones")