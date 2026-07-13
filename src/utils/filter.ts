import type { Playlist, Category } from "../data/types";
import type { FilterState } from "../components/Filters";

export interface FilterQuery {
  query: string;
  filters: FilterState;
  category: Category | "All";
}

// Builds one lowercase haystack per playlist for keyword search.
function searchableText(p: Playlist): string {
  return [
    p.title,
    p.summary,
    p.description,
    ...p.moods,
    ...p.genres,
    ...p.activities,
    ...p.categories,
  ]
    .join(" ")
    .toLowerCase();
}

// Faceted matching: OR within a filter group, AND across groups.
function matchesFilters(p: Playlist, filters: FilterState): boolean {
  if (filters.moods.length && !filters.moods.some((m) => p.moods.includes(m))) {
    return false;
  }
  if (
    filters.genres.length &&
    !filters.genres.some((g) => p.genres.includes(g))
  ) {
    return false;
  }
  if (
    filters.activities.length &&
    !filters.activities.some((a) => p.activities.includes(a))
  ) {
    return false;
  }
  return true;
}

export function filterPlaylists(
  all: Playlist[],
  { query, filters, category }: FilterQuery
): Playlist[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return all.filter((p) => {
    if (category !== "All" && !p.categories.includes(category)) {
      return false;
    }
    if (!matchesFilters(p, filters)) {
      return false;
    }
    if (terms.length) {
      const haystack = searchableText(p);
      if (!terms.every((t) => haystack.includes(t))) {
        return false;
      }
    }
    return true;
  });
}
