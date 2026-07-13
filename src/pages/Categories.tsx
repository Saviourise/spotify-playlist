import { CategoryCard } from "../components/CategoryCard";
import { SectionHead } from "../components/SectionHead";
import { PlaylistCard } from "../components/PlaylistCard";
import { playlists, getByCategory } from "../data/playlists";
import { CATEGORIES } from "../data/types";

const blurbs: Record<string, string> = {
  Trending: "The playlists on the rise, pulling the most plays this week.",
  "Recently Added": "Fresh additions to the hub, hot off the curation desk.",
  "Most Popular": "All time favourites with the biggest followings.",
  "Staff Picks": "Personal recommendations we keep coming back to.",
};

export default function Categories() {
  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow accent">Collections</span>
          <h1 className="display">Browse by category</h1>
          <p>
            Curated collections built around a moment, a mood or a milestone.
            Pick one and dive straight in.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
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

      {CATEGORIES.map((cat, ci) => {
        const list = getByCategory(cat).slice(0, 4);
        if (list.length === 0) return null;
        return (
          <section
            className="section"
            key={cat}
            style={{ paddingTop: 0 }}
          >
            <div className="container">
              <SectionHead
                eyebrow={`${String(ci + 1).padStart(2, "0")} / Collection`}
                title={cat}
                desc={blurbs[cat]}
                action={{
                  label: "View all",
                  to: `/browse?category=${encodeURIComponent(cat)}`,
                }}
              />
              <div className="strip">
                {list.map((p, i) => (
                  <PlaylistCard key={p.id} playlist={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
