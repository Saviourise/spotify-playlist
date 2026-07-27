import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { Filters, type FilterState } from "../components/Filters";
import { PlaylistGrid } from "../components/PlaylistGrid";
import { usePlaylists } from "../context/PlaylistsProvider";
import { sortBySaves, byCategory } from "../data/playlists";
import { CATEGORIES, GENRES, type Category, type Genre } from "../data/types";
import { filterPlaylists } from "../utils/filter";

const emptyFilters: FilterState = { genres: [] };
const tabs: (Category | "All")[] = ["All", ...CATEGORIES];

export default function Browse() {
  const { playlists } = usePlaylists();
  const [searchParams] = useSearchParams();

  const readCategory = useCallback((): Category | "All" => {
    const c = searchParams.get("category");
    return c && (CATEGORIES as string[]).includes(c) ? (c as Category) : "All";
  }, [searchParams]);

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [category, setCategory] = useState<Category | "All">(readCategory);
  const [filters, setFilters] = useState<FilterState>(() => {
    const genre = searchParams.get("genre");
    return {
      genres:
        genre && (GENRES as string[]).includes(genre) ? [genre as Genre] : [],
    };
  });

  useEffect(() => {
    setCategory(readCategory());
  }, [readCategory]);

  const toggleGenre = useCallback((value: Genre) => {
    setFilters((prev) => ({
      genres: prev.genres.includes(value)
        ? prev.genres.filter((g) => g !== value)
        : [...prev.genres, value],
    }));
  }, []);

  const clearFilters = useCallback(() => setFilters(emptyFilters), []);

  const resetAll = useCallback(() => {
    setFilters(emptyFilters);
    setQuery("");
    setCategory("All");
  }, []);

  const results = useMemo(() => {
    const matched = filterPlaylists(playlists, { query, filters });
    return category === "All" ? sortBySaves(matched) : byCategory(matched, category);
  }, [playlists, query, filters, category]);

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow accent">Browse the collection</span>
          <h1 className="display">Every gospel playlist, one place</h1>
          <p>
            Search by keyword or filter by genre to find the playlist your song
            belongs on.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="browse-tools">
            <SearchBar value={query} onChange={setQuery} />
            <Filters
              selected={filters}
              onToggle={toggleGenre}
              onClear={clearFilters}
              resultCount={results.length}
            />
          </div>

          <div className="tabs" style={{ margin: "10px 0 32px" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={tab === category ? "tab on" : "tab"}
                onClick={() => setCategory(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <PlaylistGrid playlists={results} onReset={resetAll} />
        </div>
      </section>
    </>
  );
}
