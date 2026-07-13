import { Icon } from "./Icon";
import {
  MOODS,
  GENRES,
  ACTIVITIES,
  type FilterGroup,
  type Mood,
  type Genre,
  type Activity,
} from "../data/types";

export interface FilterState {
  moods: Mood[];
  genres: Genre[];
  activities: Activity[];
}

interface FiltersProps {
  selected: FilterState;
  onToggle: (group: FilterGroup, value: string) => void;
  onClear: () => void;
  resultCount: number;
}

interface ChipGroupProps {
  label: string;
  options: readonly string[];
  active: readonly string[];
  onToggle: (value: string) => void;
}

function ChipGroup({ label, options, active, onToggle }: ChipGroupProps) {
  return (
    <div className="fgroup">
      <div className="fgroup-label">{label}</div>
      <div className="chips">
        {options.map((option) => {
          const on = active.includes(option);
          return (
            <button
              key={option}
              type="button"
              className={on ? "chip on" : "chip"}
              aria-pressed={on}
              onClick={() => onToggle(option)}
            >
              <span className="chip-ic" aria-hidden="true">
                <Icon name={on ? "check" : "plus"} />
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Filters({
  selected,
  onToggle,
  onClear,
  resultCount,
}: FiltersProps) {
  const activeCount =
    selected.moods.length + selected.genres.length + selected.activities.length;

  return (
    <div className="filters">
      <div className="filters-panel">
        <ChipGroup
          label="Mood"
          options={MOODS}
          active={selected.moods}
          onToggle={(value) => onToggle("Mood", value)}
        />
        <ChipGroup
          label="Genre"
          options={GENRES}
          active={selected.genres}
          onToggle={(value) => onToggle("Genre", value)}
        />
        <ChipGroup
          label="Activity"
          options={ACTIVITIES}
          active={selected.activities}
          onToggle={(value) => onToggle("Activity", value)}
        />
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
