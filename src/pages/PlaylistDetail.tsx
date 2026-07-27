import { Link, useParams } from "react-router-dom";
import { Icon, type IconName } from "../components/Icon";
import { PlaylistCard } from "../components/PlaylistCard";
import { usePlaylists } from "../context/PlaylistsProvider";
import { getById } from "../data/playlists";
import { site } from "../data/site";
import { formatCompact, formatDuration } from "../utils/format";
import NotFound from "./NotFound";

const socialIcon: Record<string, IconName> = {
  instagram: "instagram",
  twitter: "twitter",
  tiktok: "tiktok",
  spotify: "spotify",
  youtube: "youtube",
};

export default function PlaylistDetail() {
  const { id } = useParams<{ id: string }>();
  const { playlists } = usePlaylists();
  const playlist = id ? getById(playlists, id) : undefined;

  if (!playlist) {
    return <NotFound />;
  }

  const stats: { icon: IconName; value: string; label: string }[] = [
    { icon: "heart", value: formatCompact(playlist.saves), label: "Saves" },
  ];
  if (playlist.songs > 0) {
    stats.push({ icon: "list", value: String(playlist.songs), label: "Songs" });
  }
  if (playlist.durationMinutes > 0) {
    stats.push({
      icon: "clock",
      value: formatDuration(playlist.durationMinutes),
      label: "Total time",
    });
  }
  if (stats.length < 3) {
    stats.push({ icon: "music", value: playlist.genres[0], label: "Genre" });
  }
  if (stats.length < 3) {
    stats.push({ icon: "check-circle", value: "3 to 20", label: "Open spots" });
  }

  const related = playlists
    .filter(
      (p) =>
        p.id !== playlist.id &&
        p.genres.some((g) => playlist.genres.includes(g))
    )
    .slice(0, 4);

  return (
    <div className="detail">
      <div className="container">
        <Link to="/browse" className="back-link">
          <Icon name="arrow-left" />
          Back to browse
        </Link>

        <div className="detail-hero reveal">
          <div
            className="detail-cover"
            style={{ backgroundColor: playlist.coverColor }}
          >
            <span className="cover-fallback" aria-hidden="true">
              <Icon name="music" />
            </span>
            {playlist.cover ? (
              <img
                src={playlist.cover}
                alt={playlist.title}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
            <span className="dc-tag">{playlist.genres[0]}</span>
          </div>

          <div className="detail-head">
            <span className="eyebrow accent">
              {playlist.genres.join("  /  ")}
            </span>
            <h1 className="display">{playlist.title}</h1>
            <p className="detail-lede">{playlist.blurb}</p>

            <div className="tag-row">
              {playlist.genres.map((g) => (
                <span key={g} className="tag accent">
                  {g}
                </span>
              ))}
            </div>

            <div className="detail-actions">
              <a
                href={playlist.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                <Icon name="spotify" />
                Open in Spotify
              </a>
              <Link to="/browse" className="btn btn-outline btn-lg">
                Browse more
              </Link>
            </div>
          </div>
        </div>

        <div className="statline">
          {stats.map((s) => (
            <div className="st" key={s.label}>
              <div className="st-ico">
                <Icon name={s.icon} />
              </div>
              <div className="st-num num">{s.value}</div>
              <div className="st-label">{s.label}</div>
            </div>
          ))}
        </div>

        <section className="detail-section">
          <h2>About this playlist</h2>
          <p className="detail-desc">
            {playlist.blurb} A {playlist.genres.join(" and ")} playlist saved by{" "}
            {formatCompact(playlist.saves)} listeners on Spotify. Tap Open in
            Spotify to hear the full set and follow along.
          </p>
          {playlist.artists.length > 0 ? (
            <p className="detail-note">
              Featuring {playlist.artists.join(", ")}.
            </p>
          ) : null}
        </section>

        <section className="detail-section">
          <div className="contact-panel">
            <div>
              <h3>Want your song on this playlist?</h3>
              <p>
                Claim an open spot. Submissions are read individually and placed
                when the sound fits.
              </p>
            </div>
            <div className="cp-actions">
              <Link to="/submit" className="btn btn-primary">
                Submit your song
                <Icon name="chevron-right" />
              </Link>
              <div className="socials">
                {site.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                  >
                    <Icon name={socialIcon[s.icon]} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="detail-section">
            <h2>More like this</h2>
            <div className="grid" style={{ marginTop: 22 }}>
              {related.map((p, i) => (
                <PlaylistCard key={p.id} playlist={p} index={i} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
