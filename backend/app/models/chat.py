from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.session import Base

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"))
    message = Column(Text)
    response = Column(Text)
    reasoning = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="chat_history")
    topic = relationship("Topic", back_populates="chat_history")
