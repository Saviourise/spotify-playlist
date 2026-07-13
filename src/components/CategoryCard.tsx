import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import type { Category } from "../data/types";

interface CategoryCardProps {
  category: Category;
  count: number;
  cover: string;
  color: string;
}

export function CategoryCard({
  category,
  count,
  cover,
  color,
}: CategoryCardProps) {
  return (
    <Link
      to={`/browse?category=${encodeURIComponent(category)}`}
      className="cat-card"
      style={{ backgroundColor: color }}
      aria-label={`Browse ${category} playlists`}
    >
      <img src={cover} alt="" loading="lazy" />
      <div className="cat-card-body">
        <span className="cc-count num">{count} playlists</span>
        <div>
          <h3>{category}</h3>
          <span className="cc-go">
            Explore
            <Icon name="chevron-right" />
          </span>
        </div>
      </div>
    </Link>
  );
}
