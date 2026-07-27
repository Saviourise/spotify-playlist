import { fetchPlaylists } from "../lib/spotify.mjs";

// In-memory cache so repeat hits within the TTL do not re-query Spotify.
let cache = { at: 0, data: null };
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        statusCode === 200
          ? "public, max-age=21600, stale-while-revalidate=86400"
          : "no-store",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}

export const handler = async () => {
  try {
    const now = Date.now();
    if (cache.data && now - cache.at < TTL_MS) {
      return json(200, cache.data);
    }
    const data = await fetchPlaylists({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      userId: process.env.SPOTIFY_USER_ID,
      refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
    });
    cache = { at: now, data };
    return json(200, data);
  } catch (err) {
    // The frontend falls back to its committed snapshot on any error.
    return json(500, { error: String((err && err.message) || err) });
  }
};
