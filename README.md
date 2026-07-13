# Playlist Hub

A curated home for Spotify playlists, sorted by mood, genre and activity. Built
with React, TypeScript and Vite.

## Features

- Multi page site: Home, Browse, Categories, About and a detail page per playlist
- Search by keyword plus faceted filters (mood, genre, activity) and category tabs
- Each playlist detail shows plays, streams, estimated monthly streams, song
  count, followers and run time
- Contact and social details in the footer, the About page and every detail page
- Real photographic cover art, dark editorial theme, fully responsive
- No gradients and no em dashes anywhere, by design

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

## Other scripts

```bash
npm run build      # type check and build for production into dist/
npm run preview    # preview the production build locally
npm run typecheck  # run the TypeScript compiler with no output
```

## Project structure

```
src/
  components/   reusable UI (Header, Footer, Hero, PlaylistCard, Cover, ...)
  pages/        Home, Browse, Categories, About, PlaylistDetail, NotFound
  data/         playlist catalogue, site config and shared types
  utils/        number formatting and filtering helpers
  styles/       design tokens, component styles and page layouts
```

## Customising the content

- Playlists live in `src/data/playlists.ts`. Replace the sample entries, cover
  image URLs and `spotifyUrl` links with your own.
- Brand name, tagline, contact details and social links live in
  `src/data/site.ts`.
- Cover images currently point to Unsplash. Swap the `cover` value on each
  playlist for your real Spotify artwork when you go live.
