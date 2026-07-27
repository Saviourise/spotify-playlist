import type { Genre } from "./types";

// Owner maintained editorial layer, keyed by Spotify playlist id.
// Spotify does not give this app genres, song counts, durations or an artist
// list, so those can be set here per playlist. Everything else (title, cover,
// saves, description) comes live from Spotify.
export interface Override {
  genres?: Genre[];
  blurb?: string;
  featured?: boolean;
  displayTitle?: string;
  cover?: string;
  coverColor?: string;
  hidden?: boolean;
  /** Optional manual fills for data Spotify no longer exposes to the app. */
  songs?: number;
  durationMinutes?: number;
  artists?: string[];
}

export const DEFAULT_COVER_COLOR = "#171310";

// Playlists default to the Gospel genre. Classified by title/artist. To change
// any decision: edit the genre, remove `hidden`, or add an entry.
export const overrides: Record<string, Override> = {
  // ---- Featured -----------------------------------------------------------
  "5pmI4eA0RcvulhwAugZFGF": {
    featured: true,
    displayTitle: "Top 100 Gospel Songs 2026",
    genres: ["Gospel"],
  },

  // ---- Afro-gospel (gospel with an afro/amapiano groove) ------------------
  "6jgMZreG2vqoM17pj0Nfs7": { genres: ["Afro-gospel"] }, // Eze Igwe Eze Yo Yo Hello Remix
  "2ksyy3JCPgEsyTZN5jYXEM": { genres: ["Afro-gospel"] }, // Maladie Gospel Version
  "1o1jepcmQInrFsI4S2pgFA": { genres: ["Afro-gospel"] }, // Trending AI Gospel Songs 2026
  "483uJj69GDApn8oV2mCSwG": { genres: ["Afro-gospel"] }, // TikTok Viral Gospel | Naija & Africa
  "6zWAgQelQwyE1TEBbyGZt1": { genres: ["Afro-gospel"] }, // Na You Do Am
  "0dCM7TGau01DAHuDGgboEG": { genres: ["Afro-gospel"] }, // Good God - GUC & Sunmisola Agbebi

  // ---- Afrobeat (secular, kept but correctly tagged) ----------------------
  "7y5mdpXoDAKhKatdb4EuPV": { genres: ["Afrobeat"] }, // Best of Famous Pluto & Shallipopi
  "2BBqXXFQDdSOVtPcn20GIM": { genres: ["Afrobeat"] }, // Stars Misaligned (abefe)

  // ---- Hidden: non-music, secular drafts, junk/dup names ------------------
  "19kiJ3UfzQVrNPseN7dUiU": { hidden: true }, // Stranger things trailers (not music)
  "6DpwbHoqqNMzcIEgO1EDfE": { hidden: true }, // Preaching sounds & Intense (sermons)
  "0RjK6wCqMms2ztaRCpBf5M": { hidden: true }, // 19 Harsh Truths... M.I Abaga (talk)
  "5JC8mvqR1V7H1bnTolG2Qo": { hidden: true }, // Movie
  "2Y6hPeq74aAkwjtfd554Gg": { hidden: true }, // my life is a movie
  "3vtSKVC4SFNjrOkKeDKZmZ": { hidden: true }, // Old
  "3HSADscB1tBBMtBtJJzXFi": { hidden: true }, // CLASSIC
  "53zGXUhSeI9xrbsvkyhNBS": { hidden: true }, // Red Potion
  "57lyCz4DvdEKaXA4ECsyBk": { hidden: true }, // New
  "4Z9Aa4xozEkSfhVTfFWc21": { hidden: true }, // New
  "3HSPIZvoEjEBxtdtwLlFvX": { hidden: true }, // Dunno yet
  "0rrns2WOiQsfHJn8azUcaD": { hidden: true }, // Old Gospel Songs (0 saves, duplicate)
  "4Q76rzsRJTLmq3yvivJJ12": { hidden: true }, // Drakessss (secular, draft)
  "64uouJmonSlBurA3s462ym": { hidden: true }, // Rap (secular, draft)
  "35fiBp1g3U1Jl74mDI4nWh": { hidden: true }, // Laho - Rema & Shallipopi (secular)
  "4szsBjM2vk5LfYqDlWJ428": { hidden: true }, // Happy day - Zlatan Ibile (secular)
  "5maKEDwXEpxtmGYU0dkFFh": { hidden: true }, // Cubana Chiefpriest (secular)
  "3SYdgHPa4BjiZDLy374zAh": { hidden: true }, // Let me be (secular, trending draft)
};
