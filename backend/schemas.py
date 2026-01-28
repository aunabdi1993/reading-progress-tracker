from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


class BookBase(BaseModel):
    """Base schema for Book with common fields"""
    title: str = Field(..., min_length=1, max_length=255, description="Title of the book")
    author: str = Field(..., min_length=1, max_length=255, description="Author name")
    total_pages: int = Field(..., gt=0, description="Total number of pages")
    current_page: int = Field(default=0, ge=0, description="Current page number")
    status: str = Field(default="not_started", description="Reading status")
    cover_url: Optional[str] = Field(None, max_length=500, description="URL to book cover image")
    genre: Optional[str] = Field(None, max_length=100, description="Book genre")
    notes: Optional[str] = Field(None, description="Reading notes and highlights")
    rating: Optional[float] = Field(None, ge=0, le=5, description="Book rating (0-5)")
    is_favorite: bool = Field(default=False, description="Mark as favorite")

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        allowed_statuses = ['not_started', 'in_progress', 'completed']
        if v not in allowed_statuses:
            raise ValueError(f'Status must be one of {allowed_statuses}')
        return v

    @field_validator('current_page')
    @classmethod
    def validate_current_page(cls, v, info):
        # Note: total_pages validation happens after all fields are set
        return v


class BookCreate(BookBase):
    """Schema for creating a new book"""
    pass


class BookUpdate(BaseModel):
    """Schema for updating a book - all fields optional"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    author: Optional[str] = Field(None, min_length=1, max_length=255)
    total_pages: Optional[int] = Field(None, gt=0)
    current_page: Optional[int] = Field(None, ge=0)
    status: Optional[str] = None
    cover_url: Optional[str] = Field(None, max_length=500)
    genre: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    is_favorite: Optional[bool] = None

    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v is not None:
            allowed_statuses = ['not_started', 'in_progress', 'completed']
            if v not in allowed_statuses:
                raise ValueError(f'Status must be one of {allowed_statuses}')
        return v


class BookResponse(BookBase):
    """Schema for book responses including computed fields"""
    id: int
    progress_percentage: float
    pages_remaining: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProgressUpdate(BaseModel):
    """Schema for updating reading progress"""
    current_page: int = Field(..., ge=0, description="Current page number")

    @field_validator('current_page')
    @classmethod
    def validate_current_page(cls, v):
        if v < 0:
            raise ValueError('Current page cannot be negative')
        return v


class BookStats(BaseModel):
    """Schema for reading statistics"""
    total_books: int
    books_in_progress: int
    books_completed: int
    books_not_started: int
    total_pages_read: int
    average_progress: float