import snapshot from "./playlists.snapshot.json";
import { overrides, DEFAULT_COVER_COLOR } from "./overrides";
import type { Playlist, Category } from "./types";

// Raw shape returned by the Spotify function and stored in the snapshot.
export interface PlaylistRaw {
  id: string;
  title: string;
  spotifyUrl: string;
  cover: string;
  description: string;
  saves: number;
  songs: number;
  durationMinutes: number;
  artists: string[];
}

// Generate a clean, human blurb from a playlist's title and genre. The owner's
// Spotify descriptions are keyword stuffed for search, so we do not use them.
// This is deterministic (same title -> same blurb) and picks a varied line, so
// any new or changed playlist automatically gets a fitting description.
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const BLURB_BUCKETS: { test: RegExp; lines: string[] }[] = [
  {
    test: /prophetic|secret place|deep call|glory/i,
    lines: [
      "Prophetic worship and declarations for the secret place.",
      "Deep prophetic sounds for prayer, travail and quiet surrender.",
    ],
  },
  {
    test: /chant|spontaneous|soak|intercession|travail|tongues/i,
    lines: [
      "Spontaneous chants and soaking sounds to carry you into His presence.",
      "Free flowing worship chants for long, unhurried moments of prayer.",
    ],
  },
  {
    test: /worship|adoration|holy|presence|throne|surrender|shield|favour/i,
    lines: [
      "Deep, unhurried worship to still your heart and lift your eyes.",
      "Reverent worship and adoration for time alone with God.",
    ],
  },
  {
    test: /praise|party|celebrat|dance|shout|joy|yo yo|hello/i,
    lines: [
      "High energy praise to get the whole room on its feet.",
      "Joyful praise anthems made for celebration and thanksgiving.",
    ],
  },
  {
    test: /remix|reload|version|refix|mashup/i,
    lines: [
      "Fresh remixes and reworks of the songs the church already loves.",
      "Reimagined gospel favourites with a brand new bounce.",
    ],
  },
  {
    test: /old|classic|childhood|throwback|hymn|timeless/i,
    lines: [
      "Timeless gospel classics that shaped a generation.",
      "Old school gospel and hymns that never grow tired.",
    ],
  },
  {
    test: /top \d+|best of|trending|hits|202\d|chart/i,
    lines: [
      "The biggest gospel songs of the moment, refreshed as they climb.",
      "Trending gospel hits everyone has on repeat right now.",
    ],
  },
];

const AFRO_LINES = [
  "Gospel meets Afrobeat, made to move your feet and lift your spirit.",
  "Spirit filled Afro-gospel with rolling drums and big choruses.",
];

const DEFAULT_LINES = [
  "A handpicked gospel selection to soundtrack your day.",
  "Curated gospel songs for worship, work and everything in between.",
  "Gospel sounds gathered with care, updated as they grow.",
];

function pick(lines: string[], seed: number): string {
  return lines[seed % lines.length];
}

function generateBlurb(title: string, genres: string[]): string {
  const seed = hashString(title);
  for (const bucket of BLURB_BUCKETS) {
    if (bucket.test.test(title)) return pick(bucket.lines, seed);
  }
  if (genres.includes("Afrobeat") || genres.includes("Afro-gospel")) {
    return pick(AFRO_LINES, seed);
  }
  return pick(DEFAULT_LINES, seed);
}

// Merge raw Spotify data with the owner override layer into display playlists.
export function mergePlaylists(raw: PlaylistRaw[]): Playlist[] {
  return raw
    .filter((r) => !overrides[r.id]?.hidden)
    .map((r): Playlist => {
      const o = overrides[r.id] ?? {};
      const title = o.displayTitle ?? r.title;
      const genres = o.genres ?? ["Gospel"];
      return {
        id: r.id,
        title,
        spotifyUrl: r.spotifyUrl,
        cover: o.cover ?? r.cover,
        coverColor: o.coverColor ?? DEFAULT_COVER_COLOR,
        saves: r.saves,
        songs: o.songs ?? r.songs,
        durationMinutes: o.durationMinutes ?? r.durationMinutes,
        artists: o.artists ?? r.artists,
        genres,
        blurb: o.blurb ?? generateBlurb(title, genres),
        featured: o.featured ?? false,
      };
    })
    .sort((a, b) => b.saves - a.saves);
}

// The committed snapshot, merged and sorted by saves. Used as the immediate
// render and as the fallback if the live function is unavailable.
export const snapshotPlaylists: Playlist[] = mergePlaylists(
  snapshot as PlaylistRaw[]
);

// ---- Pure helpers operating on a supplied playlist list ------------------

export const sortBySaves = (list: Playlist[]): Playlist[] =>
  [...list].sort((a, b) => b.saves - a.saves);

export const topBySaves = (list: Playlist[], n: number): Playlist[] =>
  sortBySaves(list).slice(0, n);

// "Recently Added" uses the fewest saves as a proxy for newest, but never shows
// playlists with zero saves.
export const bottomBySaves = (list: Playlist[], n: number): Playlist[] =>
  list
    .filter((p) => p.saves > 0)
    .sort((a, b) => a.saves - b.saves)
    .slice(0, n);

export const getFeatured = (list: Playlist[]): Playlist | undefined =>
  list.find((p) => p.featured) ?? sortBySaves(list)[0];

export const getById = (
  list: Playlist[],
  id: string
): Playlist | undefined => list.find((p) => p.id === id);

// Trending and Most Popular show the highest saves; Recently Added shows the
// lowest saves (a proxy for the newest additions), excluding zero-save ones.
export function byCategory(list: Playlist[], category: Category): Playlist[] {
  if (category === "Recently Added") {
    return list
      .filter((p) => p.saves > 0)
      .sort((a, b) => a.saves - b.saves);
  }
  return sortBySaves(list);
}
