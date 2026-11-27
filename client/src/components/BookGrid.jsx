import { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "./BookCard.jsx";

function BookGrid({ search, genreId }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // runs again whenever search or genreId changes
  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(`${import.meta.env.VITE_API_URL}/books`, {
                params: {
          search: search || undefined,
          genreId: genreId || undefined,
          limit: 50,
        },
      })
      .then((res) => {
        // works if your API returns an array OR { data: [...] }
        const list = Array.isArray(res.data) ? res.data : res.data.data;
        setBooks(list);
      })
      .catch(() => setError("Could not load books. Try again."))
      .finally(() => setLoading(false));
  }, [search, genreId]);

   // grey placeholder cards while the books load
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="border rounded p-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }
  if (error) return <p className="text-red-600">{error}</p>;
  if (books.length === 0) return <p>No books found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {books.map((b) => (
        <BookCard key={b.id} book={b} />
      ))}
    </div>
  );
}

export default BookGrid;