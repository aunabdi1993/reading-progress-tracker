from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import os

# Database configuration
# Use environment variable or default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./reading_tracker.db")

# For SQLite, we need to enable check_same_thread=False
# For other databases, this won't have an effect
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=False  # Set to True for SQL query logging
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session.
    Use this in FastAPI route dependencies.

    Example:
        @app.get("/books")
        def get_books(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initialize database - create all tables.
    Call this when starting the application.
    """
    from models import Base
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully!")


def drop_db():
    """
    Drop all tables - use with caution!
    Useful for development/testing.
    """
    from models import Base
    Base.metadata.drop_all(bind=engine)
    print("Database dropped successfully!")