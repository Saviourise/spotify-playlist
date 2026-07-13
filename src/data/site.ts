// Central place for hub identity, contact and social details.
// Replace the placeholder values below with real details before launch.

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
    phone: string;
    location: string;
  };
  spotifyProfile: string;
  social: SocialLink[];
}

export const site: SiteConfig = {
  name: "Playlist Hub",
  tagline: "Curated Spotify playlists for every mood, moment and lifestyle.",
  heroHeadingLead: "Find the Perfect Playlist",
  heroHeadingRest: "for Every Moment",
  heroSubheading:
    "Discover carefully curated Spotify playlists based on your mood, favourite genre or daily activity.",
  contact: {
    email: "hello@playlisthub.example",
    phone: "+1 (555) 010 2030",
    location: "Available worldwide",
  },
  spotifyProfile: "https://open.spotify.com/user/playlisthub",
  social: [
    {
      label: "Instagram",
      url: "https://instagram.com/playlisthub",
      icon: "instagram",
    },
    { label: "X", url: "https://x.com/playlisthub", icon: "twitter" },
    { label: "TikTok", url: "https://tiktok.com/@playlisthub", icon: "tiktok" },
    {
      label: "Spotify",
      url: "https://open.spotify.com/user/playlisthub",
      icon: "spotify",
    },
  ],
};
