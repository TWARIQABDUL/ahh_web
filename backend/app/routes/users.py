from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..models.enums import UserRole
from ..schemas import UserResponse, UserUpdate
from ..security import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse, summary="Get current user profile", description="Retrieve the profile of the currently authenticated user.")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse, summary="Update current user profile", description="Update the profile information of the currently authenticated user.")
def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/mentors", response_model=list[UserResponse], summary="Get all mentors", description="Retrieve a list of all mentors for members to view.")
def get_all_mentors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all mentors - available to all authenticated users"""
    mentors = db.query(User).filter(User.role == UserRole.MENTOR).all()
    return mentors

@router.get("/{user_id}", response_model=UserResponse, summary="Get user by ID", description="Retrieve a user's profile by their user ID.")
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}/reset-password", summary="Reset user password (Admin only)")
def reset_user_password(
    user_id: int,
    new_password: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Reset a user's password (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Hash the new password
    from ..security import hash_password
    user.password_hash = hash_password(new_password)
    db.commit()
    
    return {"message": "Password reset successfully"}

@router.get("/", response_model=list[UserResponse], summary="Get all users", description="Retrieve a list of all users. Requires admin privileges.")
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only admins can view all users
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = db.query(User).offset(skip).limit(limit).all()
    return users