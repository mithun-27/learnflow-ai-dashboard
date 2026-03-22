from fastapi import APIRouter, Depends
from app.schemas.task import TaskResponse, TaskResult
from app.workers.celery_worker import celery_app

router = APIRouter()

@router.get("/status/{task_id}", response_model=TaskResult)
async def get_task_status(task_id: str):
    task_result = celery_app.AsyncResult(task_id)
    result = task_result.result
    if isinstance(result, Exception):
        result = str(result)
        
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": result if task_result.ready() else None
    }
