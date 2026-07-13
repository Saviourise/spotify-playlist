import { Link } from "react-router-dom";
import type { Playlist } from "../data/types";
import { Cover } from "./Cover";
import { Icon } from "./Icon";
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
        <span>{playlist.songs} songs</span>
        <span className="mdot" />
        <span>{formatDuration(playlist.durationMinutes)}</span>
      </div>
      <p className="card-summary">{playlist.summary}</p>
      <div className="card-foot">
        <span className="cf-stat num">
          <Icon name="play" />
          {formatCompact(playlist.plays)} plays
        </span>
        <span className="cf-stat num">
          <Icon name="chart" />
          {formatCompact(playlist.streams)} streams
        </span>
      </div>
    </Link>
  );
}
