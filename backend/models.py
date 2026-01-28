from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class Book(Base):
    """
    Book model for tracking reading progress
    """
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    author = Column(String(255), nullable=False)
    total_pages = Column(Integer, nullable=False)
    current_page = Column(Integer, default=0)
    status = Column(String(50), default="not_started")  # not_started, in_progress, completed
    cover_url = Column(String(500), nullable=True)
    genre = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    rating = Column(Float, nullable=True)  # 0-5 rating
    is_favorite = Column(Boolean, default=False)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def progress_percentage(self) -> float:
        """Calculate reading progress percentage"""
        if self.total_pages == 0:
            return 0.0
        return round((self.current_page / self.total_pages) * 100, 2)

    @property
    def pages_remaining(self) -> int:
        """Calculate remaining pages"""
        return max(0, self.total_pages - self.current_page)