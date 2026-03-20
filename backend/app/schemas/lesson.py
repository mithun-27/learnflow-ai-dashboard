from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LessonBase(BaseModel):
    title: str
    content: Optional[str] = None
    order_index: int

class LessonCreate(LessonBase):
    topic_id: int

class Lesson(LessonBase):
    id: int
    topic_id: int
    created_at: datetime
    class Config:
        from_attributes = True
