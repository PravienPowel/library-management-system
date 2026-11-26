import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/books/${id}`)
      .then((res) => setBook(res.data))
      .catch(() => setError("Book not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link to="/" className="text-blue-600">← Back to catalog</Link>
      <h1 className="text-2xl font-bold mt-4">{book.title}</h1>
      <p className="text-gray-600">by {book.author}</p>
      <p className="mt-2">Genre: {book.genre?.name}</p>
      <p>Copies available: {book.availableCopies}</p>
    </div>
  );
}

export default BookDetail;