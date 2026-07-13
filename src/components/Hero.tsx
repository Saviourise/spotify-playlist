import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { site } from "../data/site";
import { playlists, getFeaturedPlaylist } from "../data/playlists";
import { formatCompact } from "../utils/format";

const totalStreams = playlists.reduce((sum, p) => sum + p.streams, 0);
const totalFollowers = playlists.reduce((sum, p) => sum + p.followers, 0);

export function Hero() {
  const featured = getFeaturedPlaylist();

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy reveal" style={{ animationDelay: "0.05s" }}>
          <span className="eyebrow accent">Curated Spotify playlists</span>
          <h1 className="display">
            {site.heroHeadingLead} <span className="muted">{site.heroHeadingRest}</span>
          </h1>
          <p className="hero-sub">{site.heroSubheading}</p>

          <div className="hero-actions">
            <Link to="/browse" className="btn btn-primary btn-lg">
              <Icon name="headphones" />
              Browse playlists
            </Link>
            <Link to="/categories" className="btn btn-outline btn-lg">
              View categories
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hstat">
              <div className="hnum num">{playlists.length}</div>
              <div className="hlabel">Playlists</div>
            </div>
            <div className="hstat">
              <div className="hnum num">{formatCompact(totalStreams)}</div>
              <div className="hlabel">Total streams</div>
            </div>
            <div className="hstat">
              <div className="hnum num">{formatCompact(totalFollowers)}</div>
              <div className="hlabel">Followers</div>
            </div>
          </div>
        </div>

        <div className="hero-visual reveal" style={{ animationDelay: "0.18s" }}>
          <div className="hero-float">
            <div className="hf-num num">{formatCompact(featured.followers)}</div>
            <div className="hf-label">Followers</div>
          </div>
          <Link to={`/playlist/${featured.id}`} className="hero-cover">
            <img src={featured.cover} alt={featured.title} />
            <div className="hero-cover-over" />
            <div className="hero-cover-body">
              <span className="hero-tag">Featured</span>
              <h3>{featured.title}</h3>
              <div className="hero-cover-meta num">
                {featured.genres[0]} &middot; {featured.songs} songs &middot;{" "}
                {formatCompact(featured.streams)} streams
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
