import { Link } from "react-router-dom";
import type { Playlist } from "../data/types";
import { Cover } from "./Cover";
import { formatCompact, formatDuration } from "../utils/format";

interface PlaylistCardProps {
  playlist: Playlist;
  index?: number;
}

export function PlaylistCard({ playlist, index }: PlaylistCardProps) {
  const genre = playlist.genres[0];

  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="card"
      aria-label={`View ${playlist.title}`}
    >
      <Cover
        src={playlist.cover}
        color={playlist.coverColor}
        alt={playlist.title}
        kicker={genre}
        index={index !== undefined ? index + 1 : undefined}
      />
      <h3 className="card-title">{playlist.title}</h3>
      <div className="card-meta">
        <span className="mgenre">{genre}</span>
        <span className="mdot" />
        <span className="num">{formatCompact(playlist.saves)} saves</span>
        {playlist.songs > 0 ? (
          <>
            <span className="mdot" />
            <span>{playlist.songs} songs</span>
          </>
        ) : null}
      </div>
      <p className="card-summary">{playlist.blurb}</p>
      {playlist.durationMinutes > 0 ? (
        <div className="card-foot">
          <span className="cf-stat num">
            {formatDuration(playlist.durationMinutes)}
          </span>
        </div>
      ) : null}
    </Link>
  );
}
