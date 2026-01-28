from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import List, Optional
from datetime import datetime

from models import Book
from schemas import BookCreate, BookUpdate, BookStats


def create_book(db: Session, book: BookCreate) -> Book:
    """
    Create a new book in the database
    """
    db_book = Book(**book.model_dump())

    # Set started_at if status is in_progress
    if db_book.status == "in_progress" and not db_book.started_at:
        db_book.started_at = datetime.now()

    # Set completed_at if status is completed
    if db_book.status == "completed" and not db_book.completed_at:
        db_book.completed_at = datetime.now()
        db_book.current_page = db_book.total_pages

    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def get_book(db: Session, book_id: int) -> Optional[Book]:
    """
    Get a single book by ID
    """
    return db.query(Book).filter(Book.id == book_id).first()


def get_books(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    search: Optional[str] = None
) -> List[Book]:
    """
    Get all books with optional filtering and pagination

    Args:
        db: Database session
        skip: Number of records to skip (for pagination)
        limit: Maximum number of records to return
        status: Filter by status (not_started, in_progress, completed)
        search: Search in title and author
    """
    query = db.query(Book)

    # Filter by status if provided
    if status:
        query = query.filter(Book.status == status)

    # Search in title and author if search term provided
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Book.title.ilike(search_filter)) | (Book.author.ilike(search_filter))
        )

    # Order by updated_at descending (most recently updated first)
    query = query.order_by(Book.updated_at.desc())

    return query.offset(skip).limit(limit).all()


def update_book(db: Session, book_id: int, book_update: BookUpdate) -> Optional[Book]:
    """
    Update a book's information
    """
    db_book = get_book(db, book_id)
    if not db_book:
        return None

    update_data = book_update.model_dump(exclude_unset=True)

    # Handle status changes
    if "status" in update_data:
        new_status = update_data["status"]

        # Set started_at when moving to in_progress
        if new_status == "in_progress" and db_book.status != "in_progress":
            if not db_book.started_at:
                db_book.started_at = datetime.utcnow()

        # Set completed_at when moving to completed
        if new_status == "completed" and db_book.status != "completed":
            db_book.completed_at = datetime.utcnow()
            # Ensure current_page is set to total_pages
            if "current_page" not in update_data:
                db_book.current_page = db_book.total_pages

    # Handle current_page changes to auto-update status
    if "current_page" in update_data:
        current_page = update_data["current_page"]
        total_pages = update_data.get("total_pages", db_book.total_pages)

        # Auto-update status based on progress
        if current_page == 0 and "status" not in update_data:
            db_book.status = "not_started"
        elif current_page > 0 and current_page < total_pages and "status" not in update_data:
            db_book.status = "in_progress"
            if not db_book.started_at:
                db_book.started_at = datetime.utcnow()
        elif current_page >= total_pages and "status" not in update_data:
            db_book.status = "completed"
            if not db_book.completed_at:
                db_book.completed_at = datetime.utcnow()

    # Update all fields from update_data
    for field, value in update_data.items():
        setattr(db_book, field, value)

    db_book.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book_progress(db: Session, book_id: int, current_page: int) -> Optional[Book]:
    """
    Update book reading progress
    """
    db_book = get_book(db, book_id)
    if not db_book:
        return None

    # Ensure current_page doesn't exceed total_pages
    current_page = min(current_page, db_book.total_pages)
    db_book.current_page = current_page

    # Auto-update status based on progress
    if current_page == 0:
        db_book.status = "not_started"
        db_book.started_at = None
        db_book.completed_at = None
    elif current_page < db_book.total_pages:
        db_book.status = "in_progress"
        if not db_book.started_at:
            db_book.started_at = datetime.utcnow()
        db_book.completed_at = None
    else:  # current_page >= total_pages
        db_book.status = "completed"
        if not db_book.started_at:
            db_book.started_at = datetime.utcnow()
        if not db_book.completed_at:
            db_book.completed_at = datetime.utcnow()

    db_book.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book_notes(db: Session, book_id: int, notes: str) -> Optional[Book]:
    """
    Update book notes
    """
    db_book = get_book(db, book_id)
    if not db_book:
        return None

    db_book.notes = notes
    db_book.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_book)
    return db_book


def delete_book(db: Session, book_id: int) -> bool:
    """
    Delete a book from the database
    """
    db_book = get_book(db, book_id)
    if not db_book:
        return False

    db.delete(db_book)
    db.commit()
    return True


def get_reading_stats(db: Session) -> BookStats:
    """
    Get overall reading statistics
    """
    total_books = db.query(func.count(Book.id)).scalar()

    # Count books by status
    status_counts = db.query(
        Book.status,
        func.count(Book.id)
    ).group_by(Book.status).all()

    status_dict = {status: count for status, count in status_counts}

    books_not_started = status_dict.get("not_started", 0)
    books_in_progress = status_dict.get("in_progress", 0)
    books_completed = status_dict.get("completed", 0)

    # Calculate total pages read
    total_pages_read = db.query(func.sum(Book.current_page)).scalar() or 0

    # Calculate average progress
    if total_books > 0:
        # Get sum of all progress percentages
        total_progress = db.query(
            func.sum(
                case(
                    (Book.total_pages > 0, (Book.current_page * 100.0) / Book.total_pages),
                    else_=0
                )
            )
        ).scalar() or 0
        average_progress = round(total_progress / total_books, 2)
    else:
        average_progress = 0.0

    return BookStats(
        total_books=total_books,
        books_in_progress=books_in_progress,
        books_completed=books_completed,
        books_not_started=books_not_started,
        total_pages_read=int(total_pages_read),
        average_progress=average_progress
    )


def get_favorite_books(db: Session) -> List[Book]:
    """
    Get all favorite books
    """
    return db.query(Book).filter(Book.is_favorite == True).order_by(Book.updated_at.desc()).all()