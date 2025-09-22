from sqlalchemy import Column, Integer, Text, TIMESTAMP, func, ForeignKey, Boolean, CheckConstraint
from sqlalchemy.orm import relationship
from ..database import Base

class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    sent_at = Column(TIMESTAMP, server_default=func.now())
    is_read = Column(Boolean, default=False)

    # Constraints
    __table_args__ = (
        CheckConstraint('sender_id != receiver_id', name='check_sender_not_receiver'),
    )

    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")