// One-off snapshot generator. Run with your Spotify credentials to refresh the
// committed fallback data:
//
//   SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... SPOTIFY_USER_ID=... \
//     npm run snapshot
//
// It writes src/data/playlists.snapshot.json. The live Netlify function keeps
// numbers fresh at runtime; this snapshot is the pre-fetch/offline fallback.

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { fetchPlaylists } from "../netlify/lib/spotify.mjs";

const data = await fetchPlaylists({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  userId: process.env.SPOTIFY_USER_ID,
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
});

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, "../src/data/playlists.snapshot.json");
await writeFile(out, JSON.stringify(data, null, 2) + "\n");
console.log(`Wrote ${data.length} playlists to ${out}`);
