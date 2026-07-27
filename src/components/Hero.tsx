import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { site } from "../data/site";
import { usePlaylists } from "../context/PlaylistsProvider";
import { getFeatured } from "../data/playlists";
import { formatCompact } from "../utils/format";

export function Hero() {
  const { playlists } = usePlaylists();
  const featured = getFeatured(playlists);
  const totalSaves = playlists.reduce((sum, p) => sum + p.saves, 0);
  const totalSongs = playlists.reduce((sum, p) => sum + p.songs, 0);
  const maxSaves = playlists.reduce((m, p) => Math.max(m, p.saves), 0);

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy reveal" style={{ animationDelay: "0.05s" }}>
          <span className="eyebrow accent">Editorial and curated Spotify playlists</span>
          <h1 className="display">
            {site.heroHeadingLead}{" "}
            <span className="muted">{site.heroHeadingRest}</span>
          </h1>
          <p className="hero-sub">{site.heroSubheading}</p>

          <div className="hero-actions">
            <Link to="/browse" className="btn btn-primary btn-lg">
              <Icon name="headphones" />
              Browse playlists
            </Link>
            <Link to="/submit" className="btn btn-outline btn-lg">
              Submit your song
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hstat">
              <div className="hnum num">{playlists.length}</div>
              <div className="hlabel">Playlists</div>
            </div>
            <div className="hstat">
              <div className="hnum num">{formatCompact(totalSaves)}</div>
              <div className="hlabel">Total saves</div>
            </div>
            {totalSongs > 0 ? (
              <div className="hstat">
                <div className="hnum num">{formatCompact(totalSongs)}</div>
                <div className="hlabel">Total songs</div>
              </div>
            ) : (
              <div className="hstat">
                <div className="hnum num">{formatCompact(maxSaves)}</div>
                <div className="hlabel">Top playlist</div>
              </div>
            )}
          </div>
        </div>

        {featured ? (
          <div className="hero-visual reveal" style={{ animationDelay: "0.18s" }}>
            <div className="hero-float">
              <div className="hf-num num">{formatCompact(featured.saves)}</div>
              <div className="hf-label">Saves</div>
            </div>
            <Link to={`/playlist/${featured.id}`} className="hero-cover">
              <img src={featured.cover} alt={featured.title} />
              <div className="hero-cover-over" />
              <div className="hero-cover-body">
                <span className="hero-tag">Featured</span>
                <h3>{featured.title}</h3>
                <div className="hero-cover-meta num">
                  {featured.genres[0]} &middot; {formatCompact(featured.saves)}{" "}
                  saves
                </div>
              </div>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
