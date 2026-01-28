"use client";

import { useState } from "react";

interface AddBookFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AddBookForm({ onClose, onSuccess }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    total_pages: "",
    current_page: "0",
    status: "not_started",
    cover_url: "",
    genre: "",
    notes: "",
    rating: "",
    is_favorite: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Prepare data for API
      const bookData = {
        title: formData.title,
        author: formData.author,
        total_pages: parseInt(formData.total_pages),
        current_page: parseInt(formData.current_page),
        status: formData.status,
        cover_url: formData.cover_url || null,
        genre: formData.genre || null,
        notes: formData.notes || null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        is_favorite: formData.is_favorite,
      };

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add book");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add New Book</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Designing Data-Intensive Applications"
            />
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Martin Kleppmann"
            />
          </div>

          {/* Pages and Current Page */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="total_pages" className="block text-sm font-medium text-gray-700 mb-1">
                Total Pages *
              </label>
              <input
                type="number"
                id="total_pages"
                name="total_pages"
                value={formData.total_pages}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="616"
              />
            </div>
            <div>
              <label htmlFor="current_page" className="block text-sm font-medium text-gray-700 mb-1">
                Current Page
              </label>
              <input
                type="number"
                id="current_page"
                name="current_page"
                value={formData.current_page}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="0"
              />
            </div>
          </div>

          {/* Status and Genre */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                placeholder="Technical, Fiction, etc."
              />
            </div>
          </div>

          {/* Cover URL */}
          <div>
            <label htmlFor="cover_url" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              id="cover_url"
              name="cover_url"
              value={formData.cover_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          {/* Rating */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
              Rating (0-5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="4.5"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes / Highlights
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              placeholder="Add your reading notes, highlights, or thoughts..."
            />
          </div>

          {/* Favorite Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_favorite"
              name="is_favorite"
              checked={formData.is_favorite}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_favorite" className="ml-2 block text-sm text-gray-700">
              Mark as favorite ⭐
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding..." : "Add Book"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}