import { Link, useParams } from "react-router-dom";
import { Icon, type IconName } from "../components/Icon";
import { PlaylistCard } from "../components/PlaylistCard";
import { playlists, getPlaylistById } from "../data/playlists";
import { site } from "../data/site";
import { formatCompact, formatDuration, formatDate } from "../utils/format";
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
  const playlist = id ? getPlaylistById(id) : undefined;

  if (!playlist) {
    return <NotFound />;
  }

  const stats: { icon: IconName; value: string; label: string }[] = [
    { icon: "play", value: formatCompact(playlist.plays), label: "Total plays" },
    { icon: "chart", value: formatCompact(playlist.streams), label: "Streams" },
    {
      icon: "trending",
      value: formatCompact(playlist.estimatedMonthlyStreams),
      label: "Est. monthly",
    },
    { icon: "list", value: String(playlist.songs), label: "Songs" },
    {
      icon: "users",
      value: formatCompact(playlist.followers),
      label: "Followers",
    },
    {
      icon: "clock",
      value: formatDuration(playlist.durationMinutes),
      label: "Run time",
    },
  ];

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
          <div className="detail-cover">
            <img src={playlist.cover} alt={playlist.title} />
            <span className="dc-tag">{playlist.genres[0]}</span>
          </div>

          <div className="detail-head">
            <span className="eyebrow accent">
              {playlist.categories.join("  /  ")}
            </span>
            <h1 className="display">{playlist.title}</h1>
            <p className="detail-lede">{playlist.summary}</p>

            <div className="tag-row">
              {playlist.genres.map((g) => (
                <span key={g} className="tag accent">
                  {g}
                </span>
              ))}
              {playlist.moods.map((m) => (
                <span key={m} className="tag">
                  {m}
                </span>
              ))}
              {playlist.activities.map((a) => (
                <span key={a} className="tag">
                  {a}
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
          <p className="detail-desc">{playlist.description}</p>
          <p className="detail-note">
            Added to the hub on {formatDate(playlist.addedOn)}.
          </p>
        </section>

        <section className="detail-section">
          <div className="contact-panel">
            <div>
              <h3>Want your track on this playlist?</h3>
              <p>
                Submissions and collaborations are always open. Reach out or
                follow along on social media.
              </p>
            </div>
            <div className="cp-actions">
              <Link to="/submit" className="btn btn-primary">
                Submit your track
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
