import { Link } from "react-router-dom";
import { Icon, type IconName } from "./Icon";
import { site } from "../data/site";

const socialIcon: Record<string, IconName> = {
  instagram: "instagram",
  twitter: "twitter",
  tiktok: "tiktok",
  spotify: "spotify",
  youtube: "youtube",
};

const currentYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-col brand-col">
            <Link to="/" className="brand">
              <span className="brand-mark">
                <Icon name="logo" />
              </span>
              {site.name}
            </Link>
            <p className="footer-tagline">{site.tagline}</p>
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

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/browse">Browse</Link>
              </li>
              <li>
                <Link to="/categories">Categories</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/submit">Submit a track</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Discover</h4>
            <ul>
              <li>
                <Link to="/browse?category=Trending">Trending</Link>
              </li>
              <li>
                <Link to="/browse?category=Most+Popular">Most Popular</Link>
              </li>
              <li>
                <Link to="/browse?category=Staff+Picks">Staff Picks</Link>
              </li>
              <li>
                <a
                  href={site.spotifyProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Spotify Profile
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>
                <Icon name="mail" />
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </li>
              <li>
                <Icon name="phone" />
                <a href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <Icon name="location" />
                <span>{site.contact.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            &copy; {currentYear} {site.name}. All rights reserved.
          </span>
          <div className="fb-links">
            <Link to="/about">Privacy</Link>
            <Link to="/about">Contact</Link>
            <a
              href={site.spotifyProfile}
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
