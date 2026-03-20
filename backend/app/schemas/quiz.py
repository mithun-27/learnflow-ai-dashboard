from pydantic import BaseModel
from typing import List, Optional

class QuizQuestionBase(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class QuizQuestionCreate(QuizQuestionBase):
    quiz_id: int

class QuizQuestion(QuizQuestionBase):
    id: int
    quiz_id: int
    class Config:
        from_attributes = True

class QuizBase(BaseModel):
    lesson_id: int

class QuizCreate(QuizBase):
    pass

class Quiz(QuizBase):
    id: int
    questions: List[QuizQuestion]
    class Config:
        from_attributes = True
