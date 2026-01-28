from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import crud
import schemas
from database import get_db, init_db

# Initialize FastAPI app
app = FastAPI(
    title="Reading Progress Tracker API",
    description="API for tracking reading progress of books and articles",
    version="1.0.0"
)

# Configure CORS to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("=Ú Reading Progress Tracker API is running!")


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "Reading Progress Tracker API",
        "status": "running",
        "version": "1.0.0"
    }


# ==================== Book Endpoints ====================

@app.post("/books", response_model=schemas.BookResponse, status_code=201)
async def create_book(
    book: schemas.BookCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new book

    - **title**: Book title (required)
    - **author**: Author name (required)
    - **total_pages**: Total number of pages (required)
    - **current_page**: Current page (default: 0)
    - **status**: Reading status (default: not_started)
    - **cover_url**: URL to cover image (optional)
    - **genre**: Book genre (optional)
    - **notes**: Reading notes (optional)
    - **rating**: Book rating 0-5 (optional)
    - **is_favorite**: Mark as favorite (default: false)
    """
    return crud.create_book(db=db, book=book)


@app.get("/books", response_model=List[schemas.BookResponse])
async def get_books(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=100, description="Maximum number of records"),
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search in title and author"),
    db: Session = Depends(get_db)
):
    """
    Get all books with optional filtering

    - **skip**: Pagination offset
    - **limit**: Maximum number of books to return
    - **status**: Filter by status (not_started, in_progress, completed)
    - **search**: Search in title and author fields
    """
    return crud.get_books(db=db, skip=skip, limit=limit, status=status, search=search)


@app.get("/books/favorites", response_model=List[schemas.BookResponse])
async def get_favorite_books(db: Session = Depends(get_db)):
    """Get all favorite books"""
    return crud.get_favorite_books(db=db)


@app.get("/books/{book_id}", response_model=schemas.BookResponse)
async def get_book(book_id: int, db: Session = Depends(get_db)):
    """
    Get a single book by ID

    - **book_id**: Book ID
    """
    db_book = crud.get_book(db=db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book


@app.put("/books/{book_id}", response_model=schemas.BookResponse)
async def update_book(
    book_id: int,
    book_update: schemas.BookUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a book's information

    - **book_id**: Book ID
    - All fields are optional - only send fields you want to update
    """
    db_book = crud.update_book(db=db, book_id=book_id, book_update=book_update)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book


@app.patch("/books/{book_id}/progress", response_model=schemas.BookResponse)
async def update_book_progress(
    book_id: int,
    progress: schemas.ProgressUpdate,
    db: Session = Depends(get_db)
):
    """
    Update reading progress for a book

    - **book_id**: Book ID
    - **current_page**: Current page number

    This will automatically update the book's status based on progress.
    """
    db_book = crud.update_book_progress(
        db=db,
        book_id=book_id,
        current_page=progress.current_page
    )
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book


@app.delete("/books/{book_id}", status_code=204)
async def delete_book(book_id: int, db: Session = Depends(get_db)):
    """
    Delete a book

    - **book_id**: Book ID
    """
    success = crud.delete_book(db=db, book_id=book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")
    return None


# ==================== Statistics Endpoints ====================

@app.get("/stats", response_model=schemas.BookStats)
async def get_stats(db: Session = Depends(get_db)):
    """
    Get overall reading statistics

    Returns:
    - Total number of books
    - Books by status (not_started, in_progress, completed)
    - Total pages read
    - Average progress across all books
    """
    return crud.get_reading_stats(db=db)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)