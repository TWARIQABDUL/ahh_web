from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserLogin, UserResponse
from ..security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=UserResponse, summary="Register a new user", description="Create a new user account with the provided details. The email must be unique across all users. Passwords are securely hashed before storage.", responses={201: {"description": "User created successfully", "model": UserResponse}, 400: {"description": "Email already registered"}})
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed = hash_password(user.password)
    
    # Create user
    new_user = User(name=user.name, email=user.email, password_hash=hashed, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", summary="Authenticate user", description="Login with email and password. Returns a JWT access token and user information if credentials are valid.", responses={200: {"description": "Successful login", "content": {"application/json": {"example": {"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...", "token_type": "bearer", "user": {"id": 1, "name": "John Doe", "email": "john@example.com", "role": "entrepreneur"}}}}}, 401: {"description": "Invalid credentials"}})
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer", "user": UserResponse.from_orm(db_user)}