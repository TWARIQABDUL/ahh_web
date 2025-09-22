from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, MentorMatch
from ..schemas import MentorMatchCreate, MentorMatchResponse, MentorMatchUpdate
from ..security import get_current_user

router = APIRouter(prefix="/mentor-matches", tags=["mentor-matches"])

@router.post("/", response_model=MentorMatchResponse, summary="Create mentor match", description="Create a new mentor-member match.")
def create_mentor_match(
    match: MentorMatchCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify mentor and member exist
    mentor = db.query(User).filter(User.user_id == match.mentor_id).first()
    member = db.query(User).filter(User.user_id == match.member_id).first()
    if not mentor or not member:
        raise HTTPException(status_code=404, detail="Mentor or member not found")

    # Verify roles
    if mentor.role != "Mentor":
        raise HTTPException(status_code=400, detail="Selected user is not a mentor")
    if member.role != "Member":
        raise HTTPException(status_code=400, detail="Selected user is not a member")

    # Check if match already exists
    existing_match = db.query(MentorMatch).filter(
        ((MentorMatch.mentor_id == match.mentor_id) & (MentorMatch.member_id == match.member_id))
    ).first()
    if existing_match:
        raise HTTPException(status_code=400, detail="Match already exists between these users")

    new_match = MentorMatch(mentor_id=match.mentor_id, member_id=match.member_id)
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