"use client";

import { useState, useEffect } from "react";
import BookCard from "./components/BookCard";
import AddBookForm from "./components/AddBookForm";
import StatsCard from "./components/StatsCard";

interface Book {
  id: number;
  title: string;
  author: string;
  total_pages: number;
  current_page: number;
  status: string;
  cover_url?: string;
  genre?: string;
  notes?: string;
  rating?: number;
  is_favorite: boolean;
  progress_percentage: number;
  pages_remaining: number;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total_books: number;
  books_in_progress: number;
  books_completed: number;
  books_not_started: number;
  total_pages_read: number;
  average_progress: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`${API_URL}/books?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchBooks();
    fetchStats();
  }, [filterStatus, searchQuery]);

  // Handle book deletion
  const handleDeleteBook = async (bookId: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBooks();
        fetchStats();
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  // Handle progress update
  const handleUpdateProgress = async (bookId: number, currentPage: number) => {
    try {
      const response = await fetch(`${API_URL}/books/${bookId}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ current_page: currentPage }),
      });

      if (response.ok) {
        fetchBooks();
        fetchStats();
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📚 Reading Progress Tracker
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your reading journey, one page at a time
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              + Add Book
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Books"
              value={stats.total_books}
              icon="📖"
              color="blue"
            />
            <StatsCard
              title="In Progress"
              value={stats.books_in_progress}
              icon="📗"
              color="green"
            />
            <StatsCard
              title="Completed"
              value={stats.books_completed}
              icon="✅"
              color="purple"
            />
            <StatsCard
              title="Avg Progress"
              value={`${stats.average_progress}%`}
              icon="📊"
              color="orange"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:w-64">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Books</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg">No books found</p>
            <p className="text-gray-400 mt-2">
              Start by adding your first book!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onDelete={handleDeleteBook}
                onUpdateProgress={handleUpdateProgress}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Book Modal */}
      {showAddForm && (
        <AddBookForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchBooks();
            fetchStats();
          }}
        />
      )}
    </div>
  );
}