from fastapi import APIRouter, Depends, HTTPException
from app.schemas.topic import TopicCreate, Topic as TopicSchema, Roadmap
from app.schemas.task import TaskResponse
from app.workers.tasks import generate_roadmap_task
from app.routes.v1.auth import get_current_user
from app.models.user import User
from app.models.topic import Topic
from app.models.lesson import Lesson
from app.database.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

router = APIRouter()

from app.utils.rate_limiter import ai_gen_limiter

import logging
logger = logging.getLogger(__name__)

@router.post("/generate-roadmap", response_model=TaskResponse, dependencies=[Depends(ai_gen_limiter)])
async def generate_roadmap(
    topic_in: TopicCreate,
    current_user: User = Depends(get_current_user)
):
    try:
        task = generate_roadmap_task.delay(current_user.id, topic_in.topic)
        return {"task_id": task.id, "status": "PENDING"}
    except Exception as e:
        logger.exception(f"Error starting roadmap task: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[TopicSchema])
async def list_topics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Topic).where(Topic.user_id == current_user.id))
    return result.scalars().all()

@router.get("/{topic_id}", response_model=Roadmap)
async def get_roadmap(
    topic_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    topic = await db.get(Topic, topic_id)
    if not topic or topic.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    result = await db.execute(select(Lesson).where(Lesson.topic_id == topic_id).order_by(Lesson.order_index))
    lessons = result.scalars().all()
    
    # Structure lessons into units for the frontend
    units_dict = {}
    for lesson in lessons:
        unit_title = lesson.title.split(": ")[0] if ": " in lesson.title else "Core Units"
        lesson_name = lesson.title.split(": ")[1] if ": " in lesson.title else lesson.title
        
        if unit_title not in units_dict:
            units_dict[unit_title] = []
        units_dict[unit_title].append(lesson_name)
    
    units = [{"title": k, "lessons": v} for k, v in units_dict.items()]
    return {"topic": topic.title, "units": units}
