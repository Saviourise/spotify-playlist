import { Icon } from "./Icon";

interface CoverProps {
  src: string;
  color: string;
  alt: string;
  kicker?: string;
  index?: number;
  showPlay?: boolean;
}

// Real photographic cover with a solid legibility overlay (no gradients).
// The fallback colour shows while the image loads or if it fails to resolve.
export function Cover({
  src,
  color,
  alt,
  kicker,
  index,
  showPlay = true,
}: CoverProps) {
  return (
    <div className="cover" style={{ backgroundColor: color }}>
      <img src={src} alt={alt} loading="lazy" />
      <div className="cover-face">
        {kicker ? <span className="cover-kicker">{kicker}</span> : <span />}
        {index !== undefined ? (
          <span className="cover-index num">
            {String(index).padStart(2, "0")}
          </span>
        ) : null}
      </div>
      {showPlay ? (
        <span className="cover-play" aria-hidden="true">
          <Icon name="play" />
        </span>
      ) : null}
    </div>
  );
}
