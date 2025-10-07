from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.user import User
from ..models.ventures import Venture
from ..models.applications import Application
from ..models.mentor_matches import MentorMatch
from ..models.resources import Resource
from ..models.programs import Program
from ..models.enums import UserRole, ApplicationStatus, MatchStatus
from ..schemas.user import UserResponse
from ..schemas.ventures import VentureResponse
from ..schemas.applications import ApplicationResponse
from ..schemas.mentor_matches import MentorMatchResponse
from ..schemas.resources import ResourceResponse
from ..schemas.programs import ProgramResponse
from ..security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/member", summary="Member Dashboard")
def get_member_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Member dashboard with ventures, applications, and mentor matches"""
    if current_user.role != UserRole.MEMBER:
        raise HTTPException(status_code=403, detail="Member access only")
    
    # Get user's ventures
    ventures = db.query(Venture).filter(Venture.member_id == current_user.user_id).all()
    venture_ids = [v.venture_id for v in ventures]
    
    # Get applications for user's ventures
    applications = db.query(Application).filter(
        Application.venture_id.in_(venture_ids)
    ).all() if venture_ids else []
    
    # Get mentor matches where user is the member
    mentor_matches = db.query(MentorMatch).filter(
        MentorMatch.member_id == current_user.user_id
    ).all()
    
    # Get available programs
    available_programs = db.query(Program).filter(Program.is_active == 1).all()
    
    return {
        "user": current_user,
        "ventures": ventures,
        "applications": applications,
        "mentor_matches": mentor_matches,
        "available_programs": available_programs,
        "stats": {
            "total_ventures": len(ventures),
            "total_applications": len(applications),
            "pending_applications": len([app for app in applications if app.status == ApplicationStatus.SUBMITTED]),
            "approved_applications": len([app for app in applications if app.status == ApplicationStatus.APPROVED]),
            "mentor_connections": len([match for match in mentor_matches if match.status == MatchStatus.ACCEPTED])
        }
    }

@router.get("/mentor", summary="Mentor Dashboard")
def get_mentor_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mentor dashboard with mentee requests and shared resources"""
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Mentor access only")
    
    # Get mentor matches where user is the mentor
    mentor_matches = db.query(MentorMatch).filter(
        MentorMatch.mentor_id == current_user.user_id
    ).all()
    
    # Get pending mentee requests
    pending_requests = db.query(MentorMatch).filter(
        MentorMatch.mentor_id == current_user.user_id,
        MentorMatch.status == MatchStatus.PENDING
    ).all()
    
    # Get resources shared by this mentor
    shared_resources = db.query(Resource).filter(
        Resource.uploaded_by_id == current_user.user_id
    ).all()
    
    # Get all members for potential mentoring
    potential_mentees = db.query(User).filter(User.role == UserRole.MEMBER).all()
    
    return {
        "user": current_user,
        "mentor_matches": mentor_matches,
        "pending_requests": pending_requests,
        "shared_resources": shared_resources,
        "potential_mentees": potential_mentees,
        "stats": {
            "total_mentees": len([match for match in mentor_matches if match.status == MatchStatus.ACCEPTED]),
            "pending_requests": len(pending_requests),
            "resources_shared": len(shared_resources)
        }
    }

@router.get("/mentees", response_model=List[UserResponse], summary="Get all mentees for mentor")
def get_mentees_for_mentor(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all members/mentees with their venture profiles for mentor to view"""
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Mentor access only")
    
    # Get all members (potential mentees)
    mentees = db.query(User).filter(User.role == UserRole.MEMBER).all()
    return mentees

@router.get("/mentees/{mentee_id}/ventures", response_model=List[VentureResponse], summary="View mentee's ventures")
def get_mentee_ventures(
    mentee_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """View a specific mentee's ventures"""
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Mentor access only")
    
    # Verify mentee exists and is a member
    mentee = db.query(User).filter(
        User.user_id == mentee_id,
        User.role == UserRole.MEMBER
    ).first()
    if not mentee:
        raise HTTPException(status_code=404, detail="Mentee not found")
    
    # Get mentee's ventures
    ventures = db.query(Venture).filter(Venture.member_id == mentee_id).all()
    return ventures