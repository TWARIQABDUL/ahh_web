from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from ..database import get_db
from ..models.user import User
from ..models.ventures import Venture
from ..models.programs import Program
from ..models.applications import Application
from ..models.mentor_matches import MentorMatch
from ..models.resources import Resource
from ..models.enums import UserRole, ApplicationStatus, MatchStatus
from ..schemas.user import UserResponse, UserUpdate
from ..schemas.applications import ApplicationUpdate
from ..security import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

# Middleware to ensure only admins can access these routes
def admin_required(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/dashboard/metrics", summary="Get platform metrics")
def get_platform_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Get comprehensive platform metrics for admin dashboard"""
    
    # Count users by role
    total_users = db.query(User).count()
    approved_users = db.query(User).filter(User.is_approved == True).count()
    pending_approvals = db.query(User).filter(User.is_approved == False).count()
    admins_count = db.query(User).filter(User.role == UserRole.ADMIN).count()
    mentors_count = db.query(User).filter(User.role == UserRole.MENTOR).count()
    members_count = db.query(User).filter(User.role == UserRole.MEMBER).count()
    
    # Count ventures
    total_ventures = db.query(Venture).count()
    
    # Count applications by status
    total_applications = db.query(Application).count()
    pending_applications = db.query(Application).filter(Application.status == ApplicationStatus.SUBMITTED).count()
    approved_applications = db.query(Application).filter(Application.status == ApplicationStatus.APPROVED).count()
    
    # Count mentor matches
    total_matches = db.query(MentorMatch).count()
    active_matches = db.query(MentorMatch).filter(MentorMatch.status == MatchStatus.ACCEPTED).count()
    
    # Count programs
    total_programs = db.query(Program).count()
    active_programs = db.query(Program).filter(Program.is_active == 1).count()
    
    # Count resources
    total_resources = db.query(Resource).count()
    
    return {
        "users": {
            "total": total_users,
            "approved": approved_users,
            "pending_approval": pending_approvals,
            "admins": admins_count,
            "mentors": mentors_count,
            "members": members_count
        },
        "ventures": {
            "total": total_ventures
        },
        "applications": {
            "total": total_applications,
            "pending": pending_applications,
            "approved": approved_applications
        },
        "mentor_matches": {
            "total": total_matches,
            "active": active_matches
        },
        "programs": {
            "total": total_programs,
            "active": active_programs
        },
        "resources": {
            "total": total_resources
        }
    }

@router.get("/users", response_model=List[UserResponse], summary="Get all users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Get list of all users for admin management"""
    users = db.query(User).all()
    return users

@router.get("/users/pending", response_model=List[UserResponse], summary="Get pending user approvals")
def get_pending_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Get list of users pending approval"""
    users = db.query(User).filter(User.is_approved == False).all()
    return users

@router.put("/users/{user_id}", response_model=UserResponse, summary="Update user (Admin)")
def update_user_by_admin(
    user_id: int,
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Update any user's profile as admin"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for field, value in user_update.dict(exclude_unset=True).items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}", summary="Deactivate user")
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Deactivate a user account"""
    if user_id == current_user.user_id:
        raise HTTPException(status_code=400, detail="Cannot deactivate your own account")
        
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # For now, we'll delete the user. In production, you might want to add an 'is_active' field
    db.delete(user)
    db.commit()
    return {"message": "User deactivated successfully"}

@router.get("/applications", summary="Get all applications")
def get_all_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Get all applications for admin review"""
    applications = db.query(Application).all()
    return applications

@router.put("/applications/{application_id}/review", summary="Review application")
def review_application(
    application_id: int,
    application_update: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Review and update application status"""
    application = db.query(Application).filter(Application.application_id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Update application status and reviewer info
    if application_update.status:
        application.status = application_update.status
        application.reviewed_by = current_user.user_id
        application.reviewed_at = func.now()

    db.commit()
    db.refresh(application)
    return application

@router.put("/users/{user_id}/approve", response_model=UserResponse, summary="Approve user account")
def approve_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Approve a user account"""
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_approved = True
    db.commit()
    db.refresh(user)
    return user

@router.put("/users/{user_id}/reject", summary="Reject user account")
def reject_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Reject a user account (delete it)"""
    if user_id == current_user.user_id:
        raise HTTPException(status_code=400, detail="Cannot reject your own account")

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "User account rejected and deleted"}