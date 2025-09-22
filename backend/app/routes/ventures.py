from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Venture
from ..schemas import VentureCreate, VentureResponse, VentureUpdate
from ..security import get_current_user

router = APIRouter(prefix="/ventures", tags=["ventures"])

@router.post("/", response_model=VentureResponse, summary="Create a new venture", description="Create a new venture for the authenticated user.")
def create_venture(
    venture: VentureCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_venture = Venture(
        member_id=current_user.user_id,
        venture_name=venture.venture_name,
        description=venture.description
    )
    db.add(new_venture)
    db.commit()
    db.refresh(new_venture)
    return new_venture

@router.get("/", response_model=list[VentureResponse], summary="Get user's ventures", description="Retrieve all ventures created by the authenticated user.")
def get_user_ventures(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    ventures = db.query(Venture).filter(Venture.member_id == current_user.user_id).all()
    return ventures

@router.get("/{venture_id}", response_model=VentureResponse, summary="Get venture by ID", description="Retrieve a specific venture by its ID.")
def get_venture(
    venture_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    venture = db.query(Venture).filter(Venture.venture_id == venture_id).first()
    if not venture:
        raise HTTPException(status_code=404, detail="Venture not found")
    # Check if user owns this venture
    if venture.member_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this venture")
    return venture

@router.put("/{venture_id}", response_model=VentureResponse, summary="Update venture", description="Update a venture's information.")
def update_venture(
    venture_id: int,
    venture_update: VentureUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    venture = db.query(Venture).filter(Venture.venture_id == venture_id).first()
    if not venture:
        raise HTTPException(status_code=404, detail="Venture not found")
    if venture.member_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this venture")

    update_data = venture_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(venture, field, value)
    db.commit()
    db.refresh(venture)
    return venture

@router.delete("/{venture_id}", summary="Delete venture", description="Delete a venture.")
def delete_venture(
    venture_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    venture = db.query(Venture).filter(Venture.venture_id == venture_id).first()
    if not venture:
        raise HTTPException(status_code=404, detail="Venture not found")
    if venture.member_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this venture")

    db.delete(venture)
    db.commit()
    return {"message": "Venture deleted successfully"}