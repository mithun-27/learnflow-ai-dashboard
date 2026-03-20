import asyncio
from app.workers.celery_worker import celery_app
from app.services.ai_service import ai_service
from app.database.session import AsyncSessionLocal
from app.models.topic import Topic
from app.models.lesson import Lesson
from app.models.quiz import Quiz, QuizQuestion
from sqlalchemy import select

def run_async(coro):
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(coro)

@celery_app.task(name="generate_roadmap_task")
def generate_roadmap_task(user_id: int, topic_title: str):
    async def _logic():
        roadmap = await ai_service.generate_roadmap(topic_title)
        async with AsyncSessionLocal() as db:
            # Create Topic
            new_topic = Topic(user_id=user_id, title=topic_title)
            db.add(new_topic)
            await db.flush()
            
            # Create Lessons
            order = 0
            for unit in roadmap.units:
                for lesson_name in unit.lessons:
                    new_lesson = Lesson(
                        topic_id=new_topic.id,
                        title=f"{unit.title}: {lesson_name}",
                        order_index=order
                    )
                    db.add(new_lesson)
                    order += 1
            
            await db.commit()
            return {"topic_id": new_topic.id, "roadmap": roadmap.model_dump()}

    return run_async(_logic())

@celery_app.task(name="generate_lesson_task")
def generate_lesson_task(lesson_id: int):
    async def _logic():
        async with AsyncSessionLocal() as db:
            lesson = await db.get(Lesson, lesson_id)
            if not lesson:
                return "Lesson not found"
            
            topic = await db.get(Topic, lesson.topic_id)
            content = await ai_service.generate_lesson_content(topic.title, lesson.title)
            
            lesson.content = content
            await db.commit()
            return content

    return run_async(_logic())

@celery_app.task(name="generate_quiz_task")
def generate_quiz_task(lesson_id: int):
    async def _logic():
        async with AsyncSessionLocal() as db:
            lesson = await db.get(Lesson, lesson_id)
            if not lesson:
                return "Lesson not found"
            
            questions = await ai_service.generate_quiz(lesson.title, lesson.content)
            
            new_quiz = Quiz(lesson_id=lesson_id)
            db.add(new_quiz)
            await db.flush()
            
            for q in questions:
                new_q = QuizQuestion(
                    quiz_id=new_quiz.id,
                    question=q.question,
                    options=q.options,
                    correct_answer=q.correct_answer,
                    explanation=q.explanation
                )
                db.add(new_q)
            
            await db.commit()
            return "Quiz generated"

    return run_async(_logic())
