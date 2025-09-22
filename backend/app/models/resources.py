from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, func, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class ResourceCategory(Base):
    __tablename__ = "resourcecategories"

    category_id = Column(Integer, primary_key=True)
    category_name = Column(String(100), nullable=False, unique=True)

    # Relationship
    resources = relationship("Resource", back_populates="category")

class Resource(Base):
    __tablename__ = "resources"

    resource_id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey("resourcecategories.category_id", ondelete="CASCADE"), nullable=False)
    uploaded_by_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    url = Column(String(2048))
    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    category = relationship("ResourceCategory", back_populates="resources")
    uploaded_by = relationship("User", back_populates="resources")