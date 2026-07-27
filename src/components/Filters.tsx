import { Icon } from "./Icon";
import { GENRES, type Genre } from "../data/types";

export interface FilterState {
  genres: Genre[];
}

interface FiltersProps {
  selected: FilterState;
  onToggle: (value: Genre) => void;
  onClear: () => void;
  resultCount: number;
}

export function Filters({
  selected,
  onToggle,
  onClear,
  resultCount,
}: FiltersProps) {
  const activeCount = selected.genres.length;

  return (
    <div className="filters">
      <div className="filters-panel">
        <div className="fgroup">
          <div className="fgroup-label">Genre</div>
          <div className="chips">
            {GENRES.map((genre) => {
              const on = selected.genres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  className={on ? "chip on" : "chip"}
                  aria-pressed={on}
                  onClick={() => onToggle(genre)}
                >
                  <span className="chip-ic" aria-hidden="true">
                    <Icon name={on ? "check" : "plus"} />
                  </span>
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <span className="filters-count">
          <strong className="num">{resultCount}</strong>{" "}
          {resultCount === 1 ? "playlist" : "playlists"} match your selection
        </span>
        {activeCount > 0 ? (
          <button className="btn-clear" onClick={onClear} type="button">
            Clear filters ({activeCount})
          </button>
        ) : null}
      </div>
    </div>
  );
}
