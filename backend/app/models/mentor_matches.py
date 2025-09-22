from sqlalchemy import Column, Integer, TIMESTAMP, func, ForeignKey, Enum, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship
from ..database import Base
from .enums import MatchStatus

class MentorMatch(Base):
    __tablename__ = "mentormatches"

    match_id = Column(Integer, primary_key=True)
    mentor_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    member_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(MatchStatus, values_callable=lambda x: [e.value for e in x]), default=MatchStatus.PENDING)
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Constraints
    __table_args__ = (
        CheckConstraint('mentor_id != member_id', name='check_mentor_not_member'),
        UniqueConstraint('mentor_id', 'member_id', name='unique_mentor_member_match'),
    )

    # Relationships
    mentor = relationship("User", foreign_keys=[mentor_id], back_populates="mentor_matches_as_mentor")
    member = relationship("User", foreign_keys=[member_id], back_populates="mentor_matches_as_member")