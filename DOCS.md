# Eseosa GNF - Setup & Maintenance Guide

A curated home for Eseosa GNF's Spotify gospel playlists. This document explains
how the whole thing is built, how the live Spotify data works, and how to run,
edit and deploy it.

## Contents

1. [Overview](#1-overview)
2. [Tech stack](#2-tech-stack)
3. [Project structure](#3-project-structure)
4. [Local development](#4-local-development)
5. [How the live Spotify data works](#5-how-the-live-spotify-data-works)
6. [Spotify app setup (one time)](#6-spotify-app-setup-one-time)
7. [Environment variables](#7-environment-variables)
8. [What Spotify does and does not give us](#8-what-spotify-does-and-does-not-give-us)
9. [Managing playlists (genres, featured, hidden, blurbs)](#9-managing-playlists)
10. [Playlist descriptions](#10-playlist-descriptions)
11. [Categories and sorting](#11-categories-and-sorting)
12. [Branding (name, logo, photo, contacts, socials)](#12-branding)
13. [The WhatsApp button](#13-the-whatsapp-button)
14. [Submit a track (email notifications)](#14-submit-a-track)
15. [Deploying on Netlify](#15-deploying-on-netlify)
16. [Netlify Functions explained](#16-netlify-functions-explained)
17. [Token expiry and re-authentication](#17-token-expiry-and-re-authentication)
18. [Common tasks (cheat sheet)](#18-common-tasks)
19. [Design constraints](#19-design-constraints)

---

## 1. Overview

A single page style, multi route website that showcases Eseosa GNF's public
Spotify playlists, sorted by saves, and lets artists submit their song for a
spot on a playlist. Save counts, covers and titles come **live from Spotify**;
editorial details (genre tags, featured pick, one line descriptions) are managed
in code.

Pages: Home, Browse, Categories, About, Submit, and a detail page per playlist.

## 2. Tech stack

- **React 18 + TypeScript**, built with **Vite**
- **React Router** for the pages
- **Netlify** for hosting, serverless functions and form handling
- Plain CSS (no framework). Fonts: Bricolage Grotesque + Hanken Grotesk

## 3. Project structure

```
netlify/
  functions/playlists.mjs   Serverless endpoint that returns live playlist data
  lib/spotify.mjs           Shared Spotify fetch logic (auth + fetch)
scripts/
  spotify-auth.mjs          One time OAuth login -> writes refresh token to .env
  fetch-snapshot.mjs        Refreshes the committed fallback snapshot
src/
  context/PlaylistsProvider.tsx   Loads snapshot, then swaps in live data
  data/
    types.ts                Genre / Category / Playlist types
    playlists.ts            Merge logic, helpers, description generator
    playlists.snapshot.json Committed real-data fallback (public info only)
    overrides.ts            Owner editorial layer (genres, featured, hidden...)
    site.ts                 Brand name, contacts, socials, hero copy
  components/               Header, Footer, Hero, Cover, PlaylistCard, ...
  pages/                    Home, Browse, Categories, About, Submit, PlaylistDetail
  styles/                   index.css, components.css, pages.css
public/
  eseosa-icon.jpg           Square logo + favicon
  eseosa-gnf.jpg            Full portrait used on the About page
index.html                  Includes the hidden Netlify form for submissions
netlify.toml                Build + functions + SPA redirect config
.env                        Local secrets (gitignored, never committed)
```

## 4. Local development

```bash
npm install
npm run dev        # http://localhost:5173 (or next free port)
npm run build      # type check + production build into dist/
npm run preview    # preview the production build
```

Locally, the serverless function is not running, so the site reads the committed
snapshot (`src/data/playlists.snapshot.json`), which already holds real numbers.
To exercise the live function locally, install the Netlify CLI and run
`netlify dev` with the env vars set.

## 5. How the live Spotify data works

There are three layers, merged at runtime:

1. **Snapshot** (`playlists.snapshot.json`) - a committed copy of the real
   playlist data. It renders instantly and is the fallback if the live function
   is unavailable. Regenerate it with `npm run snapshot`.
2. **Live function** (`/.netlify/functions/playlists`) - on the deployed site,
   `PlaylistsProvider` fetches this on load. The function calls Spotify, caches
   the result for ~6 hours, and returns fresh numbers. If it fails, the snapshot
   stays.
3. **Overrides** (`overrides.ts`) - the owner's editorial layer (genres,
   featured, hidden, custom blurbs) merged on top of whichever data source is
   used.

Merge + sort logic lives in `src/data/playlists.ts` (`mergePlaylists`), always
sorted by saves (descending).

## 6. Spotify app setup (one time)

1. Go to <https://developer.spotify.com/dashboard> and **Create app** (any name).
2. In the app **Settings**, add this exact **Redirect URI**:
   `http://127.0.0.1:8888/callback`
3. Copy the **Client ID** and **Client Secret**.
4. Find the **User ID**: it is the id in the profile URL,
   `open.spotify.com/user/<USER_ID>` (currently `31j4k57fg6oqt24vinrkvieeagiu`).
5. Put those into `.env` (see below), then run the one time login:

```bash
npm run auth
```

This opens a browser. **Log in as Eseosa GNF and click Agree.** It writes
`SPOTIFY_REFRESH_TOKEN` into `.env` (the value is never printed). That refresh
token is what lets the site read the playlists.

## 7. Environment variables

Set these in `.env` locally **and** in Netlify (Site configuration ->
Environment variables). `.env` is gitignored and must never be committed.

| Variable | What it is |
| --- | --- |
| `SPOTIFY_CLIENT_ID` | From the Spotify app dashboard |
| `SPOTIFY_CLIENT_SECRET` | From the Spotify app dashboard |
| `SPOTIFY_USER_ID` | The id in the Spotify profile URL |
| `SPOTIFY_REFRESH_TOKEN` | Produced by `npm run auth` (in `.env` after login) |

After `npm run auth`, copy the `SPOTIFY_REFRESH_TOKEN` value from `.env` into
Netlify so the deployed function works.

## 8. What Spotify does and does not give us

Because of Spotify API restrictions (2024 onward), this app (unless approved for
"Extended Quota Mode") can read:

- **Available:** playlist title, cover image, save count, and the Spotify
  description, plus the list of the owner's public playlists.
- **Not available:** track list, song count, track durations, and a structured
  artist list. The `tracks` data is withheld from the API response.

Because of that:

- **Saves** drive everything (sorting, metrics, categories) and are real + live.
- **Song count and total time** are optional. They are hidden when unknown, and
  will appear automatically if you fill them per playlist in `overrides.ts` or
  if the app is later approved for Extended Quota.
- **Genres and one line descriptions** are set in code (see below), not read
  from Spotify.

## 9. Managing playlists

Everything editorial is in **`src/data/overrides.ts`**, keyed by Spotify playlist
id. Any playlist with no entry defaults to the **Gospel** genre. Fields:

```ts
{
  genres?: Genre[];        // e.g. ["Gospel"], ["Afro-gospel"], ["Afrobeat"]
  featured?: boolean;      // pin as the homepage featured playlist
  displayTitle?: string;   // override the (sometimes long) Spotify title
  blurb?: string;          // force a specific description
  hidden?: boolean;        // remove a playlist from the site
  cover?: string;          // override the cover image URL
  coverColor?: string;     // solid fallback colour behind the cover
  songs?: number;          // manual song count (since Spotify blocks it)
  durationMinutes?: number;// manual total time
  artists?: string[];      // manual artist list
}
```

Valid genres are in `src/data/types.ts` (`GENRES`): Gospel, Afro-gospel,
Afrobeat, then Hip-Hop, R&B, Pop, Amapiano, Dancehall, Jazz, Classical, Country,
Alternative.

**New playlists appear on their own** (the live function pulls all public
playlists). A new one defaults to Gospel and is not featured until you add an
entry. Secular, non music and draft playlists have been hidden - to bring one
back, delete its `hidden: true` line.

## 10. Playlist descriptions

The owner's Spotify descriptions are keyword stuffed for search, so they are not
shown. Instead, `generateBlurb()` in `src/data/playlists.ts` builds a clean one
line description from each playlist's title and genre (worship, praise, chants,
prophetic, remix, classics, trending, and afro buckets). It is deterministic and
varied, so **any new or renamed playlist automatically gets a fitting blurb**. To
override a specific one, set `blurb` in `overrides.ts`.

## 11. Categories and sorting

Categories are derived from saves, not stored per playlist:

- **Trending** and **Most Popular** - highest saves
- **Recently Added** - lowest saves (a proxy for newest, since Spotify does not
  give reliable added dates to this app)

The default order everywhere is saves, descending.

## 12. Branding

All identity lives in **`src/data/site.ts`**: `name`, `tagline`, hero copy,
`contact` (email, whatsapp, location), `spotifyProfile`, and `social` links.

- **Logo + favicon:** `public/eseosa-icon.jpg` (square). Used as the round mark
  in the header/footer and as the browser favicon (set in `index.html`).
- **About photo:** `public/eseosa-gnf.jpg` (portrait), referenced in
  `src/pages/About.tsx`.

To change any of these, replace the file (keep the name) or edit `site.ts`.

## 13. The WhatsApp button

A floating button (bottom right) on every page, from
`src/components/FloatingWhatsApp.tsx`. It links to `whatsappUrl`, which is built
from `site.contact.whatsapp` in `site.ts` (digits only -> `https://wa.me/...`).
To change the number, edit `site.contact.whatsapp`.

## 14. Submit a track

The Submit page collects: artist name, email, Spotify track link, track title,
genre, target playlist, an open spot (3 to 20) and a rights checkbox.

Submissions use **Netlify Forms**:

- A hidden detectable form lives in `index.html`; the React form POSTs to it.
- On the deployed site, Netlify captures each submission automatically.

**To receive submissions by email:** in Netlify go to *Site configuration ->
Forms -> Form notifications -> Add notification -> Email notification*, and send
to `eseosagnf@gmail.com`. Free tier allows 100 submissions per month.

(Optional upgrade: swap Netlify Forms for a serverless function + an email API
like Resend if you want fully branded emails from your own domain.)

## 15. Deploying on Netlify

1. Connect the GitHub repo (`Saviourise/spotify-playlist`) in Netlify.
2. Build settings come from `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
3. Add the four environment variables (section 7).
4. Enable the form notification email (section 14).
5. Deploy. Every push to the default branch redeploys.

The SPA redirect in `netlify.toml` (`/* -> /index.html`) keeps deep links like
`/submit` and `/playlist/:id` working on refresh.

## 16. Netlify Functions explained

You do **not** set up hosting for functions separately. On deploy, Netlify:

1. Reads `netlify.toml` and finds the `netlify/functions` directory.
2. Bundles each file (with esbuild) into a serverless function.
3. Serves it at `/.netlify/functions/<filename>` (here:
   `/.netlify/functions/playlists`).

The only requirement is that the environment variables exist in Netlify. The
function refreshes the Spotify access token itself on each run using the refresh
token, caches results for ~6 hours, and the site falls back to the snapshot if
anything fails - so the site never breaks.

## 17. Token expiry and re-authentication

- The **access token** expires hourly and is refreshed automatically by the
  function. Nothing to do.
- The **refresh token** is long lived and does not expire on a timer. It only
  becomes invalid if the Spotify password changes, the app's access is revoked,
  or Spotify forces a reset.
- If that happens, the site simply keeps showing the last snapshot. To restore
  live updates: run `npm run auth` again, then update `SPOTIFY_REFRESH_TOKEN` in
  `.env` and in Netlify, and run `npm run snapshot` to refresh the fallback.

## 18. Common tasks

| I want to... | Do this |
| --- | --- |
| Refresh the fallback numbers | `npm run snapshot` (needs env vars) |
| Re-authenticate Spotify | `npm run auth`, then update the Netlify env var |
| Re-tag a playlist's genre | Edit its entry in `src/data/overrides.ts` |
| Feature a different playlist | Move `featured: true` to another id in `overrides.ts` |
| Hide / unhide a playlist | Add / remove `hidden: true` in `overrides.ts` |
| Force a description | Set `blurb` in `overrides.ts` |
| Add song count / run time | Set `songs` / `durationMinutes` in `overrides.ts` |
| Change email / WhatsApp / socials | Edit `src/data/site.ts` |
| Change the logo / photo | Replace `public/eseosa-icon.jpg` / `public/eseosa-gnf.jpg` |
| Get submission emails | Netlify -> Forms -> notification to `eseosagnf@gmail.com` |

## 19. Design constraints

Two hard rules are kept throughout the codebase: **no CSS gradients** and **no
em dashes** in UI copy. Depth is done with solid colours, borders, shadows and a
subtle noise texture. Please keep to these when editing.
