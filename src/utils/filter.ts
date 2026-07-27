import type { Playlist, Genre } from "../data/types";

export interface FilterState {
  genres: Genre[];
}

export interface FilterQuery {
  query: string;
  filters: FilterState;
}

// Builds one lowercase haystack per playlist for keyword search.
function searchableText(p: Playlist): string {
  return [p.title, p.blurb, ...p.artists, ...p.genres]
    .join(" ")
    .toLowerCase();
}

export function filterPlaylists(
  all: Playlist[],
  { query, filters }: FilterQuery
): Playlist[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return all.filter((p) => {
    if (
      filters.genres.length &&
      !filters.genres.some((g) => p.genres.includes(g))
    ) {
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
