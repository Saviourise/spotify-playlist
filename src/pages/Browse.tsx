import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "../components/SearchBar";
import { Filters, type FilterState } from "../components/Filters";
import { PlaylistGrid } from "../components/PlaylistGrid";
import { playlists } from "../data/playlists";
import {
  CATEGORIES,
  MOODS,
  GENRES,
  ACTIVITIES,
  type Category,
  type FilterGroup,
  type Mood,
  type Genre,
  type Activity,
} from "../data/types";
import { filterPlaylists } from "../utils/filter";

const emptyFilters: FilterState = { moods: [], genres: [], activities: [] };
const tabs: (Category | "All")[] = ["All", ...CATEGORIES];

export default function Browse() {
  const [searchParams] = useSearchParams();

  const readCategory = useCallback((): Category | "All" => {
    const c = searchParams.get("category");
    return c && (CATEGORIES as string[]).includes(c)
      ? (c as Category)
      : "All";
  }, [searchParams]);

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [category, setCategory] = useState<Category | "All">(readCategory);
  const [filters, setFilters] = useState<FilterState>(() => {
    const next: FilterState = { moods: [], genres: [], activities: [] };
    const mood = searchParams.get("mood");
    const genre = searchParams.get("genre");
    const activity = searchParams.get("activity");
    if (mood && (MOODS as string[]).includes(mood)) next.moods.push(mood as Mood);
    if (genre && (GENRES as string[]).includes(genre))
      next.genres.push(genre as Genre);
    if (activity && (ACTIVITIES as string[]).includes(activity))
      next.activities.push(activity as Activity);
    return next;
  });

  // Keep the active tab in sync with cross page links (e.g. from the footer).
  useEffect(() => {
    setCategory(readCategory());
  }, [readCategory]);

  const toggleFilter = useCallback((group: FilterGroup, value: string) => {
    setFilters((prev) => {
      if (group === "Mood") {
        const v = value as Mood;
        return {
          ...prev,
          moods: prev.moods.includes(v)
            ? prev.moods.filter((x) => x !== v)
            : [...prev.moods, v],
        };
      }
      if (group === "Genre") {
        const v = value as Genre;
        return {
          ...prev,
          genres: prev.genres.includes(v)
            ? prev.genres.filter((x) => x !== v)
            : [...prev.genres, v],
        };
      }
      const v = value as Activity;
      return {
        ...prev,
        activities: prev.activities.includes(v)
          ? prev.activities.filter((x) => x !== v)
          : [...prev.activities, v],
      };
    });
  }, []);

  const clearFilters = useCallback(() => setFilters(emptyFilters), []);

  const resetAll = useCallback(() => {
    setFilters(emptyFilters);
    setQuery("");
    setCategory("All");
  }, []);

  const results = useMemo(
    () => filterPlaylists(playlists, { query, filters, category }),
    [query, filters, category]
  );

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow accent">Browse the catalogue</span>
          <h1 className="display">Every playlist, one place</h1>
          <p>
            Search by keyword or filter by mood, genre and activity to find the
            right sound for the moment.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="browse-tools">
            <SearchBar value={query} onChange={setQuery} />
            <Filters
              selected={filters}
              onToggle={toggleFilter}
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
