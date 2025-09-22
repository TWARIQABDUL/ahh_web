from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Milestone, Venture
from ..schemas import MilestoneCreate, MilestoneResponse, MilestoneUpdate
from ..security import get_current_user

router = APIRouter(prefix="/milestones", tags=["milestones"])

@router.post("/", response_model=MilestoneResponse, summary="Create milestone", description="Create a new milestone for a venture.")
def create_milestone(
    milestone: MilestoneCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify venture exists and user owns it
    venture = db.query(Venture).filter(Venture.venture_id == milestone.venture_id).first()
    if not venture:
        raise HTTPException(status_code=404, detail="Venture not found")
    if venture.member_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to create milestones for this venture")

    new_milestone = Milestone(
        venture_id=milestone.venture_id,
        title=milestone.title,
        description=milestone.description,
        due_date=milestone.due_date
    )
    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)
    return new_milestone

@router.get("/venture/{venture_id}", response_model=list[MilestoneResponse], summary="Get venture milestones", description="Retrieve all milestones for a specific venture.")
def get_venture_milestones(
    venture_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify user owns the venture
    venture = db.query(Venture).filter(Venture.venture_id == venture_id).first()
    if not venture:
        raise HTTPException(status_code=404, detail="Venture not found")
    if venture.member_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access milestones for this venture")

    milestones = db.query(Milestone).filter(Milestone.venture_id == venture_id).all()
    return milestones

@router.get("/{milestone_id}", response_model=MilestoneResponse, summary="Get milestone by ID", description="Retrieve a specific milestone by its ID.")
def get_milestone(
    milestone_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    milestone = db.query(Milestone).filter(Milestone.milestone_id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    # Check if user owns the venture this milestone belongs to
    if milestone.venture.member_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this milestone")

    return milestone

@router.put("/{milestone_id}", response_model=MilestoneResponse, summary="Update milestone", description="Update a milestone's information.")
def update_milestone(
    milestone_id: int,
    milestone_update: MilestoneUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    milestone = db.query(Milestone).filter(Milestone.milestone_id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    # Check if user owns the venture this milestone belongs to
    if milestone.venture.member_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this milestone")

    update_data = milestone_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(milestone, field, value)
    db.commit()
    db.refresh(milestone)
    return milestone

@router.delete("/{milestone_id}", summary="Delete milestone", description="Delete a milestone.")
def delete_milestone(
    milestone_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    milestone = db.query(Milestone).filter(Milestone.milestone_id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    # Check if user owns the venture this milestone belongs to
    if milestone.venture.member_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this milestone")

    db.delete(milestone)
    db.commit()
    return {"message": "Milestone deleted successfully"}