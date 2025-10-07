from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, MentorMatch
from ..models.enums import UserRole
from ..schemas import MentorMatchCreate, MentorMatchResponse, MentorMatchUpdate
from ..security import get_current_user

router = APIRouter(prefix="/mentor-matches", tags=["mentor-matches"])

@router.post("/request", response_model=MentorMatchResponse, summary="Send mentorship request", description="Members can send mentorship requests to mentors.")
def send_mentorship_request(
    mentor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Allow members to send mentorship requests to mentors"""
    if current_user.role != UserRole.MEMBER:
        raise HTTPException(status_code=403, detail="Only members can send mentorship requests")

    # Verify mentor exists and is a mentor
    mentor = db.query(User).filter(
        User.user_id == mentor_id,
        User.role == UserRole.MENTOR
    ).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")

    # Check if request already exists
    existing_match = db.query(MentorMatch).filter(
        MentorMatch.mentor_id == mentor_id,
        MentorMatch.member_id == current_user.user_id
    ).first()
    if existing_match:
        raise HTTPException(status_code=400, detail="Request already exists with this mentor")

    new_match = MentorMatch(
        mentor_id=mentor_id, 
        member_id=current_user.user_id,
        status="pending"
    )
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    return new_match

@router.get("/", response_model=list[MentorMatchResponse], summary="Get user's mentor matches", description="Retrieve mentor matches for the authenticated user.")
def get_user_mentor_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "Mentor":
        matches = db.query(MentorMatch).filter(MentorMatch.mentor_id == current_user.user_id).all()
    else:
        matches = db.query(MentorMatch).filter(MentorMatch.member_id == current_user.user_id).all()
    return matches

@router.get("/requests", response_model=list[MentorMatchResponse], summary="Get mentorship requests for mentor")
def get_mentorship_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get pending mentorship requests for mentors"""
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Only mentors can view requests")
    
    requests = db.query(MentorMatch).filter(
        MentorMatch.mentor_id == current_user.user_id,
        MentorMatch.status == "pending"
    ).all()
    return requests

@router.get("/{match_id}", response_model=MentorMatchResponse, summary="Get mentor match by ID", description="Retrieve a specific mentor match by its ID.")
def get_mentor_match(
    match_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    match = db.query(MentorMatch).filter(MentorMatch.match_id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Mentor match not found")

    # Check if user is part of this match
    if not (match.mentor_id == current_user.user_id or match.member_id == current_user.user_id):
        raise HTTPException(status_code=403, detail="Not authorized to access this match")

    return match

@router.put("/requests/{match_id}/respond", response_model=MentorMatchResponse, summary="Respond to mentorship request")
def respond_to_mentorship_request(
    match_id: int,
    accept: bool,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Allow mentors to accept or decline mentorship requests"""
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=403, detail="Only mentors can respond to requests")
    
    match = db.query(MentorMatch).filter(MentorMatch.match_id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Mentorship request not found")

    # Check if current user is the mentor for this request
    if match.mentor_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to respond to this request")
    
    # Check if request is still pending
    if match.status != "pending":
        raise HTTPException(status_code=400, detail="Request has already been responded to")

    # Update status based on mentor's response
    match.status = "accepted" if accept else "declined"
    db.commit()
    db.refresh(match)
    return match

@router.put("/{match_id}", response_model=MentorMatchResponse, summary="Update mentor match status", description="Update a mentor match's status.")
def update_mentor_match(
    match_id: int,
    match_update: MentorMatchUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    match = db.query(MentorMatch).filter(MentorMatch.match_id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Mentor match not found")

    # Check if user is part of this match
    if not (match.mentor_id == current_user.user_id or match.member_id == current_user.user_id):
        raise HTTPException(status_code=403, detail="Not authorized to update this match")

    update_data = match_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(match, field, value)
    db.commit()
    db.refresh(match)
    return match

@router.delete("/{match_id}", summary="Delete mentor match", description="Delete a mentor match.")
def delete_mentor_match(
    match_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    match = db.query(MentorMatch).filter(MentorMatch.match_id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Mentor match not found")

    # Check if user is part of this match
    if not (match.mentor_id == current_user.user_id or match.member_id == current_user.user_id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this match")

    db.delete(match)
    db.commit()
    return {"message": "Mentor match deleted successfully"}