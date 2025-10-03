from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.programs import Program
from ..models.user import User
from ..models.enums import UserRole
from ..schemas.programs import ProgramCreate, ProgramUpdate, ProgramResponse
from ..security import get_current_user

router = APIRouter(prefix="/programs", tags=["programs"])

@router.post("/", response_model=ProgramResponse, summary="Create new program (Admin only)")
def create_program(
    program: ProgramCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create programs")
    
    new_program = Program(
        title=program.title,
        description=program.description,
        requirements=program.requirements,
        benefits=program.benefits,
        duration=program.duration,
        application_deadline=program.application_deadline,
        created_by=current_user.user_id
    )
    db.add(new_program)
    db.commit()
    db.refresh(new_program)
    return new_program

@router.get("/", response_model=List[ProgramResponse], summary="Get all active programs")
def get_programs(db: Session = Depends(get_db)):
    programs = db.query(Program).filter(Program.is_active == 1).all()
    return programs

@router.get("/{program_id}", response_model=ProgramResponse, summary="Get program by ID")
def get_program(program_id: int, db: Session = Depends(get_db)):
    program = db.query(Program).filter(Program.program_id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program

@router.put("/{program_id}", response_model=ProgramResponse, summary="Update program (Admin only)")
def update_program(
    program_id: int,
    program_update: ProgramUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can update programs")
    
    program = db.query(Program).filter(Program.program_id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    for field, value in program_update.dict(exclude_unset=True).items():
        setattr(program, field, value)
    
    db.commit()
    db.refresh(program)
    return program

@router.delete("/{program_id}", summary="Delete program (Admin only)")
def delete_program(
    program_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can delete programs")
    
    program = db.query(Program).filter(Program.program_id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    # Soft delete by setting is_active to 0
    program.is_active = 0
    db.commit()
    return {"message": "Program deleted successfully"}