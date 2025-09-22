from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Message
from ..schemas import MessageCreate, MessageResponse, MessageUpdate
from ..security import get_current_user

router = APIRouter(prefix="/messages", tags=["messages"])

@router.post("/", response_model=MessageResponse, summary="Send message", description="Send a message to another user.")
def send_message(
    message: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify receiver exists
    receiver = db.query(User).filter(User.user_id == message.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    # Prevent sending message to self
    if message.receiver_id == current_user.user_id:
        raise HTTPException(status_code=400, detail="Cannot send message to yourself")

    new_message = Message(
        sender_id=current_user.user_id,
        receiver_id=message.receiver_id,
        content=message.content
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@router.get("/", response_model=list[MessageResponse], summary="Get user's messages", description="Retrieve all messages for the authenticated user.")
def get_user_messages(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    messages = db.query(Message).filter(
        (Message.sender_id == current_user.user_id) | (Message.receiver_id == current_user.user_id)
    ).order_by(Message.sent_at.desc()).all()
    return messages

@router.get("/conversation/{other_user_id}", response_model=list[MessageResponse], summary="Get conversation", description="Retrieve conversation between current user and another user.")
def get_conversation(
    other_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify other user exists
    other_user = db.query(User).filter(User.user_id == other_user_id).first()
    if not other_user:
        raise HTTPException(status_code=404, detail="User not found")

    messages = db.query(Message).filter(
        ((Message.sender_id == current_user.user_id) & (Message.receiver_id == other_user_id)) |
        ((Message.sender_id == other_user_id) & (Message.receiver_id == current_user.user_id))
    ).order_by(Message.sent_at).all()
    return messages

@router.get("/{message_id}", response_model=MessageResponse, summary="Get message by ID", description="Retrieve a specific message by its ID.")
def get_message(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    message = db.query(Message).filter(Message.message_id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    # Check if user is sender or receiver
    if not (message.sender_id == current_user.user_id or message.receiver_id == current_user.user_id):
        raise HTTPException(status_code=403, detail="Not authorized to access this message")

    return message

@router.put("/{message_id}", response_model=MessageResponse, summary="Update message read status", description="Mark a message as read.")
def update_message(
    message_id: int,
    message_update: MessageUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    message = db.query(Message).filter(Message.message_id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    # Check if user is the receiver
    if message.receiver_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this message")

    update_data = message_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(message, field, value)
    db.commit()
    db.refresh(message)
    return message

@router.delete("/{message_id}", summary="Delete message", description="Delete a message.")
def delete_message(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    message = db.query(Message).filter(Message.message_id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    # Check if user is the sender
    if message.sender_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this message")

    db.delete(message)
    db.commit()
    return {"message": "Message deleted successfully"}