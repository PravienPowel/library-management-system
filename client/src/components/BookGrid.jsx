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

  if (loading) return <p>Loading books...</p>;
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