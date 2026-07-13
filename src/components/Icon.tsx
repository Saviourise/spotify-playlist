// Inline SVG icon set. Keeps the bundle free of icon library dependencies.

export type IconName =
  | "logo"
  | "search"
  | "close"
  | "menu"
  | "plus"
  | "check"
  | "check-circle"
  | "link"
  | "user"
  | "chevron-right"
  | "arrow-left"
  | "play"
  | "headphones"
  | "list"
  | "clock"
  | "users"
  | "trending"
  | "chart"
  | "spotify"
  | "external"
  | "mail"
  | "phone"
  | "location"
  | "instagram"
  | "twitter"
  | "tiktok"
  | "youtube"
  | "music";

interface IconProps {
  name: IconName;
  className?: string;
  "aria-hidden"?: boolean;
}

// Stroke based icons share these attributes.
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Icon({ name, className }: IconProps) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    width: 24,
    height: 24,
    "aria-hidden": true,
    focusable: false as const,
  };

  switch (name) {
    case "logo":
    case "music":
      return (
        <svg {...common}>
          <path {...stroke} d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" {...stroke} />
          <circle cx="18" cy="16" r="3" {...stroke} />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" {...stroke} />
          <path {...stroke} d="m21 21-4.3-4.3" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path {...stroke} d="M18 6 6 18M6 6l12 12" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path {...stroke} d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path {...stroke} d="M12 5v14M5 12h14" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path {...stroke} d="M20 6 9 17l-5-5" />
        </svg>
      );
    case "check-circle":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" {...stroke} />
          <path {...stroke} d="m8.5 12 2.5 2.5 4.5-5" />
        </svg>
      );
    case "link":
      return (
        <svg {...common}>
          <path
            {...stroke}
            d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"
          />
          <path
            {...stroke}
            d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5"
          />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <path {...stroke} d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" {...stroke} />
        </svg>
      );
    case "chevron-right":
      return (
        <svg {...common}>
          <path {...stroke} d="m9 18 6-6-6-6" />
        </svg>
      );
    case "arrow-left":
      return (
        <svg {...common}>
          <path {...stroke} d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
        </svg>
      );
    case "headphones":
      return (
        <svg {...common}>
          <path {...stroke} d="M4 15v-3a8 8 0 0 1 16 0v3" />
          <path
            {...stroke}
            d="M18 19a2 2 0 0 0 2-2v-2a2 2 0 0 0-4 0v2a2 2 0 0 0 2 2ZM6 19a2 2 0 0 1-2-2v-2a2 2 0 0 1 4 0v2a2 2 0 0 1-2 2Z"
          />
        </svg>
      );
    case "list":
      return (
        <svg {...common}>
          <path {...stroke} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" {...stroke} />
          <path {...stroke} d="M12 7v5l3 2" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path {...stroke} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" {...stroke} />
          <path {...stroke} d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "trending":
      return (
        <svg {...common}>
          <path {...stroke} d="m3 17 6-6 4 4 8-8" />
          <path {...stroke} d="M17 7h4v4" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path {...stroke} d="M3 3v18h18" />
          <path {...stroke} d="M7 15l3-4 3 2 4-6" />
        </svg>
      );
    case "spotify":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.586 14.424a.623.623 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 1 1-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.623.623 0 0 1 .207.857Zm1.223-2.723a.78.78 0 0 1-1.072.257c-2.687-1.652-6.785-2.13-9.965-1.166a.78.78 0 1 1-.452-1.492c3.632-1.102 8.147-.568 11.234 1.329a.78.78 0 0 1 .257 1.072Zm.105-2.835c-3.223-1.914-8.54-2.09-11.618-1.156a.935.935 0 1 1-.542-1.79c3.532-1.072 9.404-.865 13.115 1.338a.936.936 0 0 1-.955 1.608Z"
          />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path {...stroke} d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" {...stroke} />
          <path {...stroke} d="m3 7 9 6 9-6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path
            {...stroke}
            d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z"
          />
        </svg>
      );
    case "location":
      return (
        <svg {...common}>
          <path {...stroke} d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" {...stroke} />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" {...stroke} />
          <circle cx="12" cy="12" r="4" {...stroke} />
          <path {...stroke} d="M17.5 6.5h.01" />
        </svg>
      );
    case "twitter":
      return (
        <svg {...common}>
          <path
            fill="currentColor"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path
            fill="currentColor"
            d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.6c-1.2.1-2.4-.2-3.5-.8v5.9c0 3.4-2.7 6.1-6.1 5.9-3-.2-5.3-2.7-5.2-5.7.1-3 2.6-5.3 5.6-5.2.3 0 .5 0 .8.1v2.7c-.3-.1-.5-.1-.8-.1-1.5 0-2.7 1.3-2.6 2.8.1 1.4 1.3 2.5 2.7 2.4 1.4 0 2.5-1.2 2.5-2.6V3h3.1Z"
          />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path {...stroke} d="M22 12s0-3.5-.4-5a2.6 2.6 0 0 0-1.8-1.8C18.2 4.7 12 4.7 12 4.7s-6.2 0-7.8.5A2.6 2.6 0 0 0 2.4 7C2 8.5 2 12 2 12s0 3.5.4 5a2.6 2.6 0 0 0 1.8 1.8c1.6.5 7.8.5 7.8.5s6.2 0 7.8-.5A2.6 2.6 0 0 0 21.6 17c.4-1.5.4-5 .4-5Z" />
          <path d="M10 15.2V8.8l5.2 3.2L10 15.2Z" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}
