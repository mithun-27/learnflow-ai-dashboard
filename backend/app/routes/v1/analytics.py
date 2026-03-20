from fastapi import APIRouter, Depends
from app.schemas.analytics import Analytics
from app.routes.v1.auth import get_current_user
from app.models.progress import Progress
from app.models.lesson import Lesson
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from sqlalchemy import select, func

router = APIRouter()

@router.get("/", response_model=Analytics)
async def get_analytics(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Lessons completed
    completed_stmt = select(func.count(Progress.id)).where(
        Progress.user_id == current_user.id,
        Progress.completed == True
    )
    completed_count = (await db.execute(completed_stmt)).scalar() or 0
    
    # Total lessons
    total_stmt = select(func.count(Lesson.id))
    total_count = (await db.execute(total_stmt)).scalar() or 1 # Avoid div by zero
    
    # Progress Percentage
    percentage = (completed_count / total_count) * 100
    
    # placeholder for scores and streak
    return Analytics(
        lessons_completed=completed_count,
        quiz_scores=[85.0, 92.5], # Mock data for now
        study_streak=5,           # Mock data for now
        progress_percentage=round(percentage, 2)
    )
