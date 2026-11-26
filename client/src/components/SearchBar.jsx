import { useState, useEffect } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    // wait 400ms after the last keystroke, then search
    const timer = setTimeout(() => onSearch(query), 400);
    // cancel the old timer when the user types again
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <input
      className="border rounded p-2 w-full"
      placeholder="Search by title or author..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

export default SearchBar;