import { Link } from "react-router-dom";
import { Hero } from "../components/Hero";
import { SectionHead } from "../components/SectionHead";
import { PlaylistCard } from "../components/PlaylistCard";
import { CategoryCard } from "../components/CategoryCard";
import { Icon } from "../components/Icon";
import { playlists, getByCategory } from "../data/playlists";
import { CATEGORIES } from "../data/types";
import { formatCompact } from "../utils/format";

const trending = getByCategory("Trending").slice(0, 4);
const fresh = [...playlists]
  .sort((a, b) => (a.addedOn < b.addedOn ? 1 : -1))
  .slice(0, 4);

const totalStreams = playlists.reduce((s, p) => s + p.streams, 0);
const totalPlays = playlists.reduce((s, p) => s + p.plays, 0);
const totalFollowers = playlists.reduce((s, p) => s + p.followers, 0);

const bandStats = [
  { num: playlists.length, label: "Curated playlists" },
  { num: formatCompact(totalStreams), label: "Lifetime streams" },
  { num: formatCompact(totalPlays), label: "Total plays" },
  { num: formatCompact(totalFollowers), label: "Followers reached" },
];

const steps = [
  {
    icon: "headphones" as const,
    title: "Pick your vibe",
    body: "Choose a mood, a genre or an activity. Every playlist is tagged so you land on the right sound fast.",
  },
  {
    icon: "list" as const,
    title: "See the details",
    body: "Open any playlist to view song count, listening time, streams, plays and estimated reach at a glance.",
  },
  {
    icon: "spotify" as const,
    title: "Play on Spotify",
    body: "One tap takes you straight to the playlist on Spotify so you can hit play and follow along.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="01 / Trending"
            title="What is hot right now"
            desc="The playlists getting the most love this week across every mood and genre."
            action={{ label: "Browse all", to: "/browse" }}
          />
          <div className="strip">
            {trending.map((p, i) => (
              <PlaylistCard key={p.id} playlist={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="marquee-band">
        <div className="container band-grid">
          {bandStats.map((s) => (
            <div className="band-stat" key={s.label}>
              <div className="bs-num num">{s.num}</div>
              <div className="bs-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="02 / Collections"
            title="Browse by category"
            desc="Jump straight into a hand built collection built around a moment or a mood."
            action={{ label: "All categories", to: "/categories" }}
          />
          <div className="cat-grid">
            {CATEGORIES.map((cat) => {
              const list = getByCategory(cat);
              const rep = list[0] ?? playlists[0];
              return (
                <CategoryCard
                  key={cat}
                  category={cat}
                  count={list.length}
                  cover={rep.cover}
                  color={rep.coverColor}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead
            eyebrow="03 / Fresh"
            title="Recently added"
            desc="New drops added to the hub, updated as the catalogue grows."
            action={{ label: "Browse all", to: "/browse" }}
          />
          <div className="strip">
            {fresh.map((p, i) => (
              <PlaylistCard key={p.id} playlist={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead
            eyebrow="04 / How it works"
            title="From a feeling to a playlist in seconds"
          />
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step" key={s.title}>
                <div className="step-ix num">{String(i + 1).padStart(2, "0")}</div>
                <div className="step-ico">
                  <Icon name={s.icon} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta">
            <div>
              <h2>Ready to find your next favourite playlist?</h2>
              <p>
                Explore the full catalogue and filter by mood, genre or activity
                to find the perfect soundtrack for any moment.
              </p>
            </div>
            <Link to="/browse" className="btn btn-primary btn-lg">
              Start browsing
              <Icon name="chevron-right" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
