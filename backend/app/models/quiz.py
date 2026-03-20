from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))

    lesson = relationship("Lesson", back_populates="quizzes")
    questions = relationship("QuizQuestion", back_populates="quiz")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    question = Column(String)
    options = Column(JSON)  # List of strings
    correct_answer = Column(String)
    explanation = Column(String)

    quiz = relationship("Quiz", back_populates="questions")
