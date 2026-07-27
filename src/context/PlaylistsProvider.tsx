import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Playlist } from "../data/types";
import {
  snapshotPlaylists,
  mergePlaylists,
  type PlaylistRaw,
} from "../data/playlists";

interface PlaylistsContextValue {
  playlists: Playlist[];
  loading: boolean;
  live: boolean;
}

const PlaylistsContext = createContext<PlaylistsContextValue>({
  playlists: snapshotPlaylists,
  loading: false,
  live: false,
});

// Renders immediately from the committed snapshot, then swaps in fresh numbers
// from the Netlify function once it responds. Falls back to the snapshot if the
// function is missing (e.g. before Spotify credentials are configured).
export function PlaylistsProvider({ children }: { children: ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>(snapshotPlaylists);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/.netlify/functions/playlists")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((raw: PlaylistRaw[]) => {
        if (alive && Array.isArray(raw) && raw.length > 0) {
          setPlaylists(mergePlaylists(raw));
          setLive(true);
        }
      })
      .catch(() => {
        // Keep the snapshot; the site still works with real (if slightly stale) numbers.
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <PlaylistsContext.Provider value={{ playlists, loading, live }}>
      {children}
    </PlaylistsContext.Provider>
  );
}

export function usePlaylists(): PlaylistsContextValue {
  return useContext(PlaylistsContext);
}
