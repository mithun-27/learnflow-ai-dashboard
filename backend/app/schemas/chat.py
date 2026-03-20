from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class ChatTurn(BaseModel):
    role: str # "user" or "assistant"
    content: str
    reasoning_details: Optional[str] = None

class ChatMessage(BaseModel):
    user_message: str
    topic_id: int
    lesson_id: Optional[int] = None
    history: Optional[List[ChatTurn]] = []

class ChatHistory(BaseModel):
    id: int
    user_id: int
    topic_id: int
    message: str
    response: str
    timestamp: datetime
    class Config:
        from_attributes = True
