"use client";

import { useState } from "react";

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
}

interface BookCardProps {
  book: Book;
  onDelete: (bookId: number) => void;
  onUpdateProgress: (bookId: number, currentPage: number) => void;
}

const statusColors = {
  not_started: "bg-gray-100 text-gray-700 border-gray-300",
  in_progress: "bg-blue-100 text-blue-700 border-blue-300",
  completed: "bg-green-100 text-green-700 border-green-300",
};

const statusLabels = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

export default function BookCard({ book, onDelete, onUpdateProgress }: BookCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(book.current_page);

  const handleUpdateProgress = () => {
    if (currentPage >= 0 && currentPage <= book.total_pages) {
      onUpdateProgress(book.id, currentPage);
      setIsEditing(false);
    }
  };

  const handleQuickUpdate = (pages: number) => {
    const newPage = Math.min(Math.max(0, book.current_page + pages), book.total_pages);
    onUpdateProgress(book.id, newPage);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{book.title}</h3>
          <p className="text-sm text-gray-600">by {book.author}</p>
          {book.genre && (
            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded">
              {book.genre}
            </span>
          )}
        </div>
        {book.is_favorite && <span className="text-2xl">⭐</span>}
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${
            statusColors[book.status as keyof typeof statusColors]
          }`}
        >
          {statusLabels[book.status as keyof typeof statusLabels]}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">Progress</span>
          <span className="font-bold text-indigo-600">{book.progress_percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${book.progress_percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span>
            {book.current_page} / {book.total_pages} pages
          </span>
          <span>{book.pages_remaining} remaining</span>
        </div>
      </div>

      {/* Rating */}
      {book.rating && (
        <div className="mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">
                {i < book.rating! ? "★" : "☆"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {book.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 italic line-clamp-2">{book.notes}</p>
        </div>
      )}

      {/* Progress Update */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        {isEditing ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max={book.total_pages}
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Current page"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateProgress}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentPage(book.current_page);
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Quick Update Buttons */}
            {book.status !== "completed" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickUpdate(10)}
                  className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  +10 pages
                </button>
                <button
                  onClick={() => handleQuickUpdate(25)}
                  className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  +25 pages
                </button>
                <button
                  onClick={() => handleQuickUpdate(50)}
                  className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  +50 pages
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
              >
                Update Progress
              </button>
              <button
                onClick={() => onDelete(book.id)}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}