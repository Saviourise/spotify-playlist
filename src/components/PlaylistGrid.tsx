import type { Playlist } from "../data/types";
import { PlaylistCard } from "./PlaylistCard";

interface PlaylistGridProps {
  playlists: Playlist[];
  onReset?: () => void;
  showIndex?: boolean;
}

export function PlaylistGrid({
  playlists,
  onReset,
  showIndex = true,
}: PlaylistGridProps) {
  if (playlists.length === 0) {
    return (
      <div className="empty">
        <h3>No playlists found</h3>
        <p>Try a different search term or clear a few filters.</p>
        {onReset ? (
          <button className="btn btn-outline" onClick={onReset} type="button">
            Reset everything
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid">
      {playlists.map((playlist, i) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          index={showIndex ? i : undefined}
        />
      ))}
    </div>
  );
}
