import { Link } from "react-router-dom";
import { Hero } from "../components/Hero";
import { SectionHead } from "../components/SectionHead";
import { PlaylistCard } from "../components/PlaylistCard";
import { CategoryCard } from "../components/CategoryCard";
import { Icon } from "../components/Icon";
import { usePlaylists } from "../context/PlaylistsProvider";
import { topBySaves, bottomBySaves } from "../data/playlists";
import { formatCompact } from "../utils/format";

const steps = [
  {
    icon: "search" as const,
    title: "Find the playlist that fits",
    body: "Browse by genre and vibe to find the gospel playlist your song belongs on.",
  },
  {
    icon: "list" as const,
    title: "Pick an open spot",
    body: "Choose an available spot (3 to 20) in the playlist you want your track placed in.",
  },
  {
    icon: "spotify" as const,
    title: "Submit and get placed",
    body: "Send your Spotify link. If it fits the sound, your song goes live on the playlist.",
  },
];

export default function Home() {
  const { playlists } = usePlaylists();
  const trending = topBySaves(playlists, 4);
  const fresh = bottomBySaves(playlists, 4);
  const topByPop = topBySaves(playlists, 2);
  const lowest = bottomBySaves(playlists, 1);

  const totalSaves = playlists.reduce((s, p) => s + p.saves, 0);
  const maxSaves = playlists.reduce((m, p) => Math.max(m, p.saves), 0);
  const genreCount = new Set(playlists.flatMap((p) => p.genres)).size;

  const bandStats = [
    { num: playlists.length, label: "Gospel playlists" },
    { num: formatCompact(totalSaves), label: "Total saves" },
    { num: formatCompact(maxSaves), label: "Biggest playlist" },
    { num: genreCount, label: "Genres" },
  ];

  const categoryCards = [
    {
      category: "Trending" as const,
      caption: "Hottest right now",
      cover: topByPop[0]?.cover ?? "",
      color: topByPop[0]?.coverColor ?? "#171310",
    },
    {
      category: "Most Popular" as const,
      caption: "All time favourites",
      cover: topByPop[1]?.cover ?? topByPop[0]?.cover ?? "",
      color: topByPop[1]?.coverColor ?? "#171310",
    },
    {
      category: "Recently Added" as const,
      caption: "Freshly added",
      cover: lowest[0]?.cover ?? "",
      color: lowest[0]?.coverColor ?? "#171310",
    },
  ];

  return (
    <>
      <Hero />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="01 / Trending"
            title="Gospel heat right now"
            desc="The playlists getting the most love this week, ranked by saves."
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
            desc="Jump straight into the sound you are after, sorted the way you like."
            action={{ label: "All playlists", to: "/browse" }}
          />
          <div className="cat-grid">
            {categoryCards.map((c) => (
              <CategoryCard
                key={c.category}
                category={c.category}
                caption={c.caption}
                cover={c.cover}
                color={c.color}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead
            eyebrow="03 / Fresh"
            title="Recently added"
            desc="New drops added to the collection, updated as it grows."
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
            eyebrow="04 / For artists"
            title="Get your song on a gospel playlist"
          />
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step" key={s.title}>
                <div className="step-ix num">
                  {String(i + 1).padStart(2, "0")}
                </div>
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
              <h2>Ready to find the playlist for your song?</h2>
              <p>
                Explore the full collection, filter by genre, and claim an open
                spot on the gospel playlist that fits your sound.
              </p>
            </div>
            <Link to="/submit" className="btn btn-primary btn-lg">
              Submit your song
              <Icon name="chevron-right" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
