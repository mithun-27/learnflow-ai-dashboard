from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")
