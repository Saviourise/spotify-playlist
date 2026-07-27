// Core domain types for the Eseosa GNF playlist hub.

// Genre order matters: Gospel, Afro-gospel and Afrobeat lead, the rest follow.
export type Genre =
  | "Gospel"
  | "Afro-gospel"
  | "Afrobeat"
  | "Hip-Hop"
  | "R&B"
  | "Pop"
  | "Amapiano"
  | "Dancehall"
  | "Jazz"
  | "Classical"
  | "Country"
  | "Alternative";

// Categories are derived from saves, not stored per playlist.
export type Category = "Trending" | "Most Popular" | "Recently Added";

export interface Playlist {
  /** URL friendly identifier (the Spotify playlist id). */
  id: string;
  title: string;
  /** External Spotify playlist link. */
  spotifyUrl: string;
  /** Real cover art (Spotify image url, or a placeholder before creds are set). */
  cover: string;
  /** Solid fallback colour shown while the cover loads (no gradients used). */
  coverColor: string;
  /** Saves / followers on Spotify. */
  saves: number;
  /** Number of tracks in the playlist. */
  songs: number;
  /** Total listening time in minutes. */
  durationMinutes: number;
  /** A few of the artists featured in the playlist. */
  artists: string[];
  /** Genre tags (owner assigned via overrides). */
  genres: Genre[];
  /** Short one line summary shown on cards and the detail page. */
  blurb: string;
  featured?: boolean;
}

export const GENRES: Genre[] = [
  "Gospel",
  "Afro-gospel",
  "Afrobeat",
  "Hip-Hop",
  "R&B",
  "Pop",
  "Amapiano",
  "Dancehall",
  "Jazz",
  "Classical",
  "Country",
  "Alternative",
];

export const CATEGORIES: Category[] = [
  "Trending",
  "Most Popular",
  "Recently Added",
];
