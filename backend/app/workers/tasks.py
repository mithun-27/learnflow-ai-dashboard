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
            # Generate default roadmap_graph
            nodes = []
            edges = []
            
            # Root node
            nodes.append({
                "id": "root",
                "position": {"x": 400, "y": 0},
                "data": {"label": topic_title},
                "className": "bg-primary text-primary-foreground border-none rounded-xl px-5 py-3 font-semibold text-sm w-auto shadow-md"
            })
            
            y_offset = 150
            x_start = 100
            x_gap = 300
            
            current_order = 0
            for i, unit in enumerate(roadmap.units):
                unit_id = f"unit_{i}"
                nodes.append({
                    "id": unit_id,
                    "position": {"x": x_start + (i * x_gap), "y": y_offset},
                    "data": {"label": unit.title},
                    "className": "bg-sidebar-accent border-2 border-primary/40 rounded-xl px-4 py-2 text-[13px] text-foreground font-medium shadow-sm"
                })
                edges.append({
                    "id": f"e-root-{unit_id}",
                    "source": "root",
                    "target": unit_id,
                    "style": {"stroke": "hsl(var(--primary))", "strokeWidth": 2}
                })
                
                # Add lessons as children
                for j, lesson_name in enumerate(unit.lessons):
                    lesson_id = f"lesson_{current_order}"
                    nodes.append({
                        "id": lesson_id,
                        "position": {"x": x_start + (i * x_gap), "y": y_offset + 100 + (j * 80)},
                        "data": {"label": lesson_name},
                        "className": "bg-card border border-border rounded-lg px-3.5 py-2 text-xs text-foreground shadow-sm"
                    })
                    edges.append({
                        "id": f"e-{unit_id}-{lesson_id}",
                        "source": unit_id,
                        "target": lesson_id,
                        "style": {"stroke": "hsl(var(--primary) / 0.5)"}
                    })
                    
                    # Create Lesson record
                    new_lesson = Lesson(
                        topic_id=new_topic.id,
                        title=f"{unit.title}: {lesson_name}",
                        order_index=current_order
                    )
                    db.add(new_lesson)
                    current_order += 1
            
            new_topic.roadmap_graph = {"nodes": nodes, "edges": edges}
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
            
            # Trigger quiz generation as related content
            from app.workers.tasks import generate_quiz_task
            generate_quiz_task.delay(lesson.id)
            
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
