import { Link } from "react-router-dom";

function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`} className="border rounded p-4 hover:shadow">
      <h2 className="font-bold">{book.title}</h2>
      <p className="text-gray-600">by {book.author}</p>
    </Link>
  );
}

export default BookCard;