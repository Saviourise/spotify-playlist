import { useState } from "react";
import { Icon } from "./Icon";

interface CoverProps {
  src: string;
  color: string;
  alt: string;
  kicker?: string;
  index?: number;
  showPlay?: boolean;
}

// Real playlist cover with a solid legibility overlay (no gradients). If the
// image is missing or fails to load, a branded fallback (solid colour + music
// mark) is shown instead of a broken image.
export function Cover({
  src,
  color,
  alt,
  kicker,
  index,
  showPlay = true,
}: CoverProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className="cover" style={{ backgroundColor: color }}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="cover-fallback" aria-hidden="true">
          <Icon name="music" />
        </span>
      )}
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
