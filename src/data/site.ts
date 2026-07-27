// Central place for hub identity, contact and social details.

export interface SocialLink {
  label: string;
  url: string;
  icon: "instagram" | "twitter" | "tiktok" | "spotify" | "youtube";
}

export interface SiteConfig {
  name: string;
  tagline: string;
  heroHeadingLead: string;
  heroHeadingRest: string;
  heroSubheading: string;
  contact: {
    email: string;
    /** Display form of the WhatsApp number, e.g. "+234 800 000 0000". */
    whatsapp: string;
    location: string;
  };
  spotifyProfile: string;
  social: SocialLink[];
}

export const site: SiteConfig = {
  name: "Eseosa GNF",
  tagline: "Editorial and curated Spotify gospel playlists.",
  heroHeadingLead: "There's a Playlist",
  heroHeadingRest: "for You",
  heroSubheading:
    "Discover carefully curated gospel playlists, sorted by genre.",
  contact: {
    email: "eseosagnf@gmail.com",
    whatsapp: "+234 810 921 9718",
    location: "Available worldwide",
  },
  spotifyProfile:
    "https://open.spotify.com/user/31j4k57fg6oqt24vinrkvieeagiu",
  social: [
    {
      label: "Instagram",
      url: "https://instagram.com/eseosa_gnf",
      icon: "instagram",
    },
    { label: "X", url: "https://x.com/eseosa_gnf", icon: "twitter" },
    {
      label: "Spotify",
      url: "https://open.spotify.com/user/31j4k57fg6oqt24vinrkvieeagiu",
      icon: "spotify",
    },
  ],
};

/** Digits only, for wa.me and tel links. */
export const whatsappDigits = site.contact.whatsapp.replace(/[^\d]/g, "");
export const whatsappUrl = `https://wa.me/${whatsappDigits}`;
