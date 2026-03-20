from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TopicBase(BaseModel):
    title: Optional[str] = None

class TopicCreate(TopicBase):
    topic: str  # The topic to generate roadmap for

class Topic(TopicBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class RoadmapUnit(BaseModel):
    title: str
    lessons: List[str]

class Roadmap(BaseModel):
    topic: str
    units: List[RoadmapUnit]
