import { Icon } from "./Icon";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search">
      <Icon name="search" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search playlists, artists or genres. Try Gospel, Afro-gospel or Worship"
        aria-label="Search playlists"
      />
      {value ? (
        <button
          className="search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
          type="button"
        >
          <Icon name="close" />
        </button>
      ) : null}
    </div>
  );
}
