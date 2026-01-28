# Demo Mode with Mock Data

The Reading Progress Tracker frontend includes built-in demo/mock data that allows you to explore the application without requiring the backend API to be running.

## How It Works

When the backend API is unavailable (e.g., not running on `localhost:8000`), the application automatically falls back to using mock data stored in `/src/app/data/mockBooks.json`.

## Mock Data Includes

- **10 Example Books** featuring:
  - Classic literature (The Great Gatsby, 1984, To Kill a Mockingbird)
  - Self-help (Atomic Habits)
  - Technology (The Pragmatic Programmer, Clean Code, Designing Data-Intensive Applications)
  - History (Sapiens)
  - Business (The Lean Startup)
  - Fantasy (The Hobbit)

- **Various Reading Statuses**:
  - 3 Completed books
  - 5 In Progress books
  - 2 Not Started books

- **Realistic Statistics**:
  - Total books: 10
  - Books in progress: 5
  - Books completed: 3
  - Books not started: 2
  - Total pages read: 1,752
  - Average progress: 47%

## Features That Work with Mock Data

✅ **Full filtering** - Filter by status (All, Not Started, In Progress, Completed)
✅ **Search functionality** - Search by book title or author name
✅ **Statistics display** - View all reading statistics
✅ **Book display** - See all book cards with progress bars
✅ **Responsive design** - All UI components work normally

## Features That DON'T Work with Mock Data

❌ **Adding new books** - Requires backend API
❌ **Updating progress** - Requires backend API
❌ **Deleting books** - Requires backend API
❌ **Data persistence** - Changes are not saved

## Use Cases

1. **Frontend Development** - Work on UI/UX without running the backend
2. **Demos/Presentations** - Show the application with realistic data
3. **Testing** - Verify frontend functionality independently
4. **Quick Preview** - Explore the app without full setup

## Switching Between Mock and Live Data

The application automatically detects API availability:

- **Backend Running** → Uses live data from API
- **Backend Not Running** → Falls back to mock data

No configuration needed - it's completely automatic!

## Customizing Mock Data

To customize the demo data, edit the file:
```
/src/app/data/mockBooks.json
```

The JSON structure matches the API response format, so any changes should follow the same schema.

## For Development

When developing locally:

1. **With Backend**: Start both frontend and backend for full functionality
2. **Frontend Only**: Start just the frontend to work on UI with mock data

```bash
# Frontend only (uses mock data)
npm run dev

# Full stack (uses live data)
# Terminal 1: Start backend
cd ../backend && uvicorn main:app --reload

# Terminal 2: Start frontend
npm run dev
```

## Note

Mock data is only used as a fallback. Once the backend API is available and responding, the application will automatically switch to using live data.