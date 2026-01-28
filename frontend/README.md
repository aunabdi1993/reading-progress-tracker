# Reading Progress Tracker - Frontend

A modern, responsive web application for tracking your reading progress across multiple books and articles. Built with Next.js 16, TypeScript, and Tailwind CSS 4.

## Overview

This is the frontend application for the Reading Progress Tracker. It provides a beautiful, user-friendly interface for managing your reading list, tracking progress, viewing statistics, and organizing your books.

## Features

- **Beautiful Dashboard**: Modern, responsive design with gradient backgrounds and smooth animations
- **Real-time Updates**: Instant feedback when updating book progress
- **Quick Actions**: Fast progress updates with +10, +25, +50 pages buttons
- **Statistics Cards**: Visual metrics showing total books, in progress, completed, and average progress
- **Search & Filter**: Find books by title/author and filter by reading status
- **Book Management**: Add, edit, and delete books with a clean modal interface
- **Progress Visualization**: Visual progress bars with percentage completion
- **Mobile-First**: Fully responsive design that works on all devices

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS 4** - Utility-first CSS framework
- **React 19** - Latest React features with hooks

## Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun
- Backend API running on `http://localhost:8000` (see [main README](../README.md))

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables (optional):

Create a `.env.local` file if you need to customize the API URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`.

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

The page auto-updates as you edit files thanks to Fast Refresh.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start production server (requires build first)
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
frontend/
├── src/
│   └── app/
│       ├── components/
│       │   ├── AddBookForm.tsx    # Modal form for adding books
│       │   ├── BookCard.tsx       # Individual book display card
│       │   └── StatsCard.tsx      # Statistics display card
│       ├── globals.css            # Global styles and Tailwind
│       ├── layout.tsx             # Root layout component
│       └── page.tsx               # Main dashboard page
├── public/                        # Static assets
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Key Components

### `page.tsx`
Main dashboard component that:
- Fetches and displays books from the API
- Manages search and filter state
- Shows statistics cards
- Handles book CRUD operations

### `BookCard.tsx`
Displays individual book information:
- Book title, author, genre
- Progress bar and percentage
- Quick update buttons (+10, +25, +50 pages)
- Rating display
- Delete functionality

### `AddBookForm.tsx`
Modal form for adding new books:
- Title and author (required)
- Total pages, current page
- Genre, rating, notes
- Form validation
- API integration

### `StatsCard.tsx`
Reusable statistics display:
- Icon, title, and value
- Color-coded styling
- Responsive design

## API Integration

The frontend connects to the FastAPI backend at `http://localhost:8000` (configurable via `NEXT_PUBLIC_API_URL`).

Key endpoints used:
- `GET /books` - Fetch all books with optional filters
- `POST /books` - Add a new book
- `PATCH /books/{id}/progress` - Update reading progress
- `DELETE /books/{id}` - Delete a book
- `GET /stats` - Fetch reading statistics

## Development Tips

1. **Hot Reload**: The development server automatically reloads when you save changes
2. **TypeScript**: Type definitions are in each component file
3. **Tailwind**: Use utility classes for styling (defined in `globals.css`)
4. **State Management**: Uses React hooks (`useState`, `useEffect`)
5. **Error Handling**: Console errors are logged for debugging

## Building for Production

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

The production build is optimized for performance with:
- Minified code
- Optimized images
- Code splitting
- Static page generation where possible

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set the `NEXT_PUBLIC_API_URL` environment variable to your backend URL
4. Deploy

### Other Platforms

You can deploy to any platform that supports Node.js:
- Netlify
- AWS Amplify
- Railway
- Render

Make sure to:
- Set the correct `NEXT_PUBLIC_API_URL` environment variable
- Run `npm run build` before deployment
- Use `npm start` to run the production server

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [React Documentation](https://react.dev) - React library
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/docs/) - TypeScript language

## Contributing

1. Make sure the backend is running
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Full Project

See the [main README](../README.md) for:
- Complete project overview
- Backend setup instructions
- API documentation
- Database configuration
- Full feature list

## Support

For issues or questions, please create an issue in the GitHub repository.
