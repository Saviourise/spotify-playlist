// Core domain types for the Playlist Hub.

export type Mood =
  | "Happy"
  | "Sad"
  | "Romantic"
  | "Chill"
  | "Motivational"
  | "Peaceful";

export type Activity =
  | "Workout"
  | "Studying"
  | "Sleeping"
  | "Driving"
  | "Cooking"
  | "Reading"
  | "Gaming"
  | "Party";

export type Genre =
  | "Afrobeats"
  | "Hip-Hop"
  | "R&B"
  | "Gospel"
  | "Pop"
  | "Amapiano"
  | "Dancehall"
  | "Jazz"
  | "Classical"
  | "Country"
  | "Alternative";

export type Category =
  | "Trending"
  | "Recently Added"
  | "Most Popular"
  | "Staff Picks";

// The three filter groups shown to visitors.
export type FilterGroup = "Mood" | "Genre" | "Activity";

export interface Playlist {
  /** URL friendly identifier used in the detail route. */
  id: string;
  title: string;
  /** Short one line summary shown on cards. */
  summary: string;
  /** Longer description shown on the detail page. */
  description: string;
  moods: Mood[];
  genres: Genre[];
  activities: Activity[];
  categories: Category[];
  /** Number of tracks in the playlist. */
  songs: number;
  /** Total listening time in minutes. */
  durationMinutes: number;
  /** Saves / followers on Spotify. */
  followers: number;
  /** Lifetime streams across the playlist. */
  streams: number;
  /** Total number of plays recorded. */
  plays: number;
  /** Projected streams for the next 30 days. */
  estimatedMonthlyStreams: number;
  /** Real cover photograph. */
  cover: string;
  /** Solid fallback colour shown while the cover loads (no gradients used). */
  coverColor: string;
  /** External Spotify playlist link. */
  spotifyUrl: string;
  /** ISO date the playlist was added to the hub. */
  addedOn: string;
  featured?: boolean;
}

export const MOODS: Mood[] = [
  "Happy",
  "Sad",
  "Romantic",
  "Chill",
  "Motivational",
  "Peaceful",
];

export const ACTIVITIES: Activity[] = [
  "Workout",
  "Studying",
  "Sleeping",
  "Driving",
  "Cooking",
  "Reading",
  "Gaming",
  "Party",
];

export const GENRES: Genre[] = [
  "Afrobeats",
  "Hip-Hop",
  "R&B",
  "Gospel",
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
  "Recently Added",
  "Most Popular",
  "Staff Picks",
];
