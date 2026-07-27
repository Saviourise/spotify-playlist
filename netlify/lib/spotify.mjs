// Shared Spotify fetch logic used by both the Netlify function (runtime) and
// the snapshot script (build/dev time). Uses the Client Credentials flow, so it
// only ever reads public data and never needs a user login.

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

// Exchange the long lived refresh token (from the one-time OAuth login) for a
// short lived user access token. App-only tokens can no longer read a user's
// playlists, so a user token is required.
async function getAccessToken(clientId, clientSecret, refreshToken) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });
  if (!res.ok) throw new Error(`Spotify token refresh failed: ${res.status}`);
  const json = await res.json();
  return json.access_token;
}

async function spotifyGet(url, token) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Spotify GET ${url} -> ${res.status}`);
  return res.json();
}

// Returns the raw playlist array the app expects (id, title, spotifyUrl, cover,
// saves, songs, durationMinutes, artists), sorted by saves descending.
export async function fetchPlaylists({
  clientId,
  clientSecret,
  userId,
  refreshToken,
}) {
  if (!clientId || !clientSecret || !userId) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_USER_ID"
    );
  }
  if (!refreshToken) {
    throw new Error(
      "Missing SPOTIFY_REFRESH_TOKEN. Run the one-time login: npm run auth"
    );
  }

  const token = await getAccessToken(clientId, clientSecret, refreshToken);

  // 1. The signed in user's playlists, then keep only the ones they own.
  const items = [];
  let url = `${API}/me/playlists?limit=50`;
  while (url) {
    const page = await spotifyGet(url, token);
    items.push(...(page.items || []));
    url = page.next;
  }
  // Only the user's own PUBLIC playlists (exclude private/secret ones).
  const owned = items.filter(
    (p) => p && p.owner && p.owner.id === userId && p.public === true
  );

  // 2. Title, cover, link and description come straight from the list response.
  //    Only the save count needs a per playlist call, so we run those in
  //    parallel batches to stay well inside the function time limit. Track data
  //    (song count, durations, artists) is not available to this app.
  let saveFails = 0;

  async function withSaves(p) {
    let saves = 0;
    try {
      const detail = await spotifyGet(
        `${API}/playlists/${p.id}?fields=followers(total)`,
        token
      );
      saves = (detail.followers && detail.followers.total) || 0;
    } catch {
      saveFails++;
    }
    return {
      id: p.id,
      title: p.name,
      spotifyUrl:
        (p.external_urls && p.external_urls.spotify) ||
        `https://open.spotify.com/playlist/${p.id}`,
      cover: (p.images && p.images[0] && p.images[0].url) || "",
      description: p.description || "",
      saves,
      songs: 0,
      durationMinutes: 0,
      artists: [],
    };
  }

  const out = [];
  const BATCH = 12;
  for (let i = 0; i < owned.length; i += BATCH) {
    const batch = owned.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(withSaves));
    out.push(...results);
  }

  if (saveFails) {
    console.warn(`Spotify: ${saveFails}/${owned.length} save-count calls failed.`);
  }

  out.sort((a, b) => b.saves - a.saves);
  return out;
}
