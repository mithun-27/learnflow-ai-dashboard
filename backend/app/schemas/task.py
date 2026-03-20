from pydantic import BaseModel
from typing import Optional, Any

class TaskResponse(BaseModel):
    task_id: str
    status: str

class TaskResult(BaseModel):
    task_id: str
    status: str
    result: Optional[Any] = None
