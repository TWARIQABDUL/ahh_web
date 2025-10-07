from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Application, Venture
from ..schemas import ApplicationCreate, ApplicationResponse, ApplicationUpdate
from ..security import get_current_user

router = APIRouter(prefix="/applications", tags=["applications"])

@router.post("/", response_model=ApplicationResponse, summary="Create application", description="Submit an application for a venture.")
def create_application(
    application: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify venture exists and belongs to user
    venture = db.query(Venture).filter(
        Venture.venture_id == application.venture_id,
        Venture.member_id == current_user.user_id
    ).first()
    if not venture:
        raise HTTPException(status_code=404, detail="Venture not found or does not belong to you")

    # Check if user already applied to this venture
    existing_application = db.query(Application).filter(
        Application.venture_id == application.venture_id
    ).first()
    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied to this venture")

    new_application = Application(
        venture_id=application.venture_id,
        program_id=application.program_id
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application

@router.get("/", response_model=list[ApplicationResponse], summary="Get user's applications", description="Retrieve all applications submitted by the authenticated user.")
def get_user_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get ventures owned by user, then get applications for those ventures
    user_ventures = db.query(Venture).filter(Venture.member_id == current_user.user_id).all()
    venture_ids = [v.venture_id for v in user_ventures]

    applications = db.query(Application).filter(
        Application.venture_id.in_(venture_ids)
    ).all()
    return applications

@router.get("/{application_id}", response_model=ApplicationResponse, summary="Get application by ID", description="Retrieve a specific application by its ID.")
def get_application(
    application_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.application_id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Check if user owns the venture this application is for
    if application.venture.member_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this application")

    return application

@router.put("/{application_id}", response_model=ApplicationResponse, summary="Update application status", description="Update an application's status.")
def update_application(
    application_id: int,
    application_update: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.application_id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Check if user owns the venture this application is for
    if application.venture.member_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this application")

    update_data = application_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(application, field, value)
    db.commit()
    db.refresh(application)
    return application