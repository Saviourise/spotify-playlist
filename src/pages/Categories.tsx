import { CategoryCard } from "../components/CategoryCard";
import { SectionHead } from "../components/SectionHead";
import { PlaylistGrid } from "../components/PlaylistGrid";
import { usePlaylists } from "../context/PlaylistsProvider";
import { sortBySaves, topBySaves, bottomBySaves } from "../data/playlists";
import { CATEGORIES, type Category } from "../data/types";

const captions: Record<Category, string> = {
  Trending: "Hottest right now",
  "Most Popular": "All time favourites",
  "Recently Added": "Freshly added",
};

export default function Categories() {
  const { playlists } = usePlaylists();
  const top = topBySaves(playlists, 2);
  const lowest = bottomBySaves(playlists, 1);

  const covers: Record<Category, { cover: string; color: string }> = {
    Trending: {
      cover: top[0]?.cover ?? "",
      color: top[0]?.coverColor ?? "#171310",
    },
    "Most Popular": {
      cover: top[1]?.cover ?? top[0]?.cover ?? "",
      color: top[1]?.coverColor ?? "#171310",
    },
    "Recently Added": {
      cover: lowest[0]?.cover ?? "",
      color: lowest[0]?.coverColor ?? "#171310",
    },
  };

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow accent">Collections</span>
          <h1 className="display">Browse by category</h1>
          <p>
            Gospel collections ranked the way you want them, from the hottest
            right now to the freshest additions.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="cat-grid">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat}
                category={cat}
                caption={captions[cat]}
                cover={covers[cat].cover}
                color={covers[cat].color}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead
            eyebrow="Collection"
            title="All playlists"
            desc="The full gospel collection, ranked by saves."
            action={{ label: "Open browse", to: "/browse" }}
          />
          <PlaylistGrid playlists={sortBySaves(playlists)} />
        </div>
      </section>
    </>
  );
}
