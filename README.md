# Backend - Reading Progress Tracker API

FastAPI-based REST API for tracking reading progress across books and articles.

## Tech Stack

- **FastAPI** (v0.115.6) - Modern, fast web framework for building APIs
- **SQLAlchemy** (v2.0.36) - SQL toolkit and ORM
- **Pydantic** (v2.10.4) - Data validation using Python type hints
- **Uvicorn** (v0.34.0) - ASGI server for running FastAPI
- **SQLite** - Default database (easily switchable to PostgreSQL/MySQL)

## Project Structure

```
backend/
├── main.py           # FastAPI application and API routes
├── models.py         # SQLAlchemy database models
├── schemas.py        # Pydantic schemas for request/response validation
├── database.py       # Database configuration and session management
├── crud.py           # CRUD operations (Create, Read, Update, Delete)
├── requirements.txt  # Python dependencies
└── .venv/           # Virtual environment (created during setup)
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv .venv
```

3. Activate the virtual environment:

**macOS/Linux:**
```bash
source .venv/bin/activate
```

**Windows:**
```bash
.venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

### Running the Server

Start the development server with auto-reload:
```bash
uvicorn main:app --reload
```

The API will be available at:
- **API Base URL**: http://localhost:8000
- **Interactive API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative Documentation**: http://localhost:8000/redoc (ReDoc)

## API Endpoints

### Books

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/books` | Create a new book |
| GET | `/books` | Get all books (with optional filters) |
| GET | `/books/{book_id}` | Get a specific book by ID |
| PUT | `/books/{book_id}` | Update a book's information |
| PATCH | `/books/{book_id}/progress` | Update reading progress |
| DELETE | `/books/{book_id}` | Delete a book |
| GET | `/books/favorites` | Get all favorite books |

### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Get overall reading statistics |

### Query Parameters

**GET /books**
- `skip` (int): Pagination offset (default: 0)
- `limit` (int): Maximum number of records (default: 100, max: 100)
- `status` (string): Filter by status (not_started, in_progress, completed)
- `search` (string): Search in title and author fields

## Data Models

### Book Schema

**BookCreate (Request)**
```json
{
  "title": "string (required)",
  "author": "string (required)",
  "total_pages": "integer (required)",
  "current_page": "integer (default: 0)",
  "status": "string (default: not_started)",
  "cover_url": "string (optional)",
  "genre": "string (optional)",
  "notes": "string (optional)",
  "rating": "integer 0-5 (optional)",
  "is_favorite": "boolean (default: false)"
}
```

**BookResponse**
```json
{
  "id": "integer",
  "title": "string",
  "author": "string",
  "total_pages": "integer",
  "current_page": "integer",
  "progress_percentage": "float",
  "status": "string",
  "cover_url": "string | null",
  "genre": "string | null",
  "notes": "string | null",
  "rating": "integer | null",
  "is_favorite": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Statistics Schema

**BookStats (Response)**
```json
{
  "total_books": "integer",
  "not_started": "integer",
  "in_progress": "integer",
  "completed": "integer",
  "total_pages_read": "integer",
  "average_progress": "float"
}
```

## Database

### Default Configuration

The application uses SQLite by default. The database file `reading_tracker.db` is automatically created in the backend directory when you first run the server.

### Database Initialization

The database is automatically initialized on server startup. The `init_db()` function in `database.py` creates all necessary tables based on the SQLAlchemy models.

### Switching Databases

To use PostgreSQL or MySQL, set the `DATABASE_URL` environment variable:

**PostgreSQL:**
```bash
export DATABASE_URL="postgresql://username:password@localhost:5432/reading_tracker"
```

**MySQL:**
```bash
export DATABASE_URL="mysql://username:password@localhost:3306/reading_tracker"
```

Then install the appropriate database driver:
```bash
# PostgreSQL
pip install psycopg2-binary

# MySQL
pip install pymysql
```

## Development

### Auto-reload

The development server runs with `--reload` flag, which automatically restarts the server when code changes are detected.

### API Documentation

FastAPI automatically generates interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs - Try out API endpoints directly
- **ReDoc**: http://localhost:8000/redoc - Alternative documentation view

### CORS Configuration

The API is configured to accept requests from:
- http://localhost:3000
- http://localhost:3001

To modify allowed origins, edit the `allow_origins` list in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    ...
)
```

## Testing the API

You can test the API using:

1. **Swagger UI** (http://localhost:8000/docs)
   - Interactive interface to try out endpoints
   - Automatically includes request/response schemas

2. **curl**
   ```bash
   # Create a book
   curl -X POST "http://localhost:8000/books" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "The Great Gatsby",
       "author": "F. Scott Fitzgerald",
       "total_pages": 180
     }'

   # Get all books
   curl "http://localhost:8000/books"

   # Get statistics
   curl "http://localhost:8000/stats"
   ```

3. **HTTPie**
   ```bash
   http POST localhost:8000/books title="1984" author="George Orwell" total_pages=328
   ```

## Common Tasks

### Add a new endpoint

1. Define Pydantic schema in `schemas.py`
2. Add database model if needed in `models.py`
3. Create CRUD function in `crud.py`
4. Add route in `main.py`

### Modify database schema

1. Update model in `models.py`
2. Delete `reading_tracker.db` (development only)
3. Restart server to recreate database

For production, use a database migration tool like Alembic.

## Troubleshooting

**Import errors:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

**Database errors:**
- Check if `reading_tracker.db` has correct permissions
- Try deleting the database file and restart server

**Port already in use:**
- Change port: `uvicorn main:app --reload --port 8001`
- Or kill the process using port 8000

## Production Deployment

For production deployment:

1. Set environment variables:
   ```bash
   export DATABASE_URL="your_production_database_url"
   ```

2. Run with production settings:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

3. Consider using:
   - **Gunicorn** with Uvicorn workers
   - **Docker** for containerization
   - **Nginx** as reverse proxy
   - **SSL/TLS** certificates for HTTPS

## License

This project is open source and available for personal use.
