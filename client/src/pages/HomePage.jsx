import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar.jsx";
import BookGrid from "../components/BookGrid.jsx";

function HomePage() {
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState("");
  const [genres, setGenres] = useState([]);

  // load the genres once for the dropdown
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/genres`)
      .then((res) => setGenres(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Library Catalog</h1>

      <div className="flex gap-2 mb-4">
        <SearchBar onSearch={setSearch} />
        <select
          className="border rounded p-2"
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <BookGrid search={search} genreId={genreId} />
    </div>
  );
}

export default HomePage;