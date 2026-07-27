// One-time Spotify OAuth login. Run as the playlist owner (Eseosa GNF):
//
//   npm run auth
//
// It opens a browser, you log in and authorize, and it writes
// SPOTIFY_REFRESH_TOKEN into your local .env (the value is never printed).
// Afterwards, add that same SPOTIFY_REFRESH_TOKEN to your Netlify env vars.
//
// Prerequisite: in the Spotify app dashboard (Settings -> Redirect URIs), add
//   http://127.0.0.1:8888/callback

import http from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { exec } from "node:child_process";
import { randomBytes } from "node:crypto";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Missing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET in .env");
  process.exit(1);
}

const PORT = 8888;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPE = "playlist-read-private playlist-read-collaborative";
const state = randomBytes(8).toString("hex");

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: REDIRECT,
    scope: SCOPE,
    state,
  }).toString();

async function upsertEnv(key, value) {
  let content = "";
  try {
    content = await readFile(".env", "utf8");
  } catch {
    /* no .env yet */
  }
  const line = `${key}=${value}`;
  if (new RegExp(`^${key}=`, "m").test(content)) {
    content = content.replace(new RegExp(`^${key}=.*$`, "m"), line);
  } else {
    content = content.replace(/\s*$/, "") + "\n" + line + "\n";
  }
  await writeFile(".env", content);
}

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith("/callback")) {
    res.writeHead(404);
    res.end();
    return;
  }
  const u = new URL(req.url, REDIRECT);
  const code = u.searchParams.get("code");
  const returnedState = u.searchParams.get("state");
  if (!code || returnedState !== state) {
    res.writeHead(400);
    res.end("Authorization failed or state mismatch. Close this and retry.");
    server.close();
    process.exit(1);
    return;
  }
  try {
    const tokRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT,
      }).toString(),
    });
    if (!tokRes.ok) throw new Error(`token exchange failed: ${tokRes.status}`);
    const json = await tokRes.json();
    if (!json.refresh_token) throw new Error("no refresh_token returned");
    await upsertEnv("SPOTIFY_REFRESH_TOKEN", json.refresh_token);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h2>Authorized. You can close this tab and return to the terminal.</h2>"
    );
    console.log("\nSuccess. SPOTIFY_REFRESH_TOKEN written to .env (not shown).");
    console.log("Next: add that SPOTIFY_REFRESH_TOKEN to your Netlify env vars,");
    console.log("then run: npm run snapshot\n");
    setTimeout(() => {
      server.close();
      process.exit(0);
    }, 400);
  } catch (err) {
    res.writeHead(500);
    res.end("Error: " + err.message);
    console.error(err.message);
    server.close();
    process.exit(1);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("\nMake sure this Redirect URI is added to your Spotify app:");
  console.log("  " + REDIRECT);
  console.log("\nOpening the login page. Sign in as Eseosa GNF and click Agree.");
  console.log("If it does not open, paste this URL in your browser:\n");
  console.log(authUrl + "\n");
  exec(`open "${authUrl}"`, () => {});
});
