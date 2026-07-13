import { SectionHead } from "../components/SectionHead";
import { Icon, type IconName } from "../components/Icon";
import { site } from "../data/site";

const aboutImage =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&h=1100&q=80";

const values = [
  {
    icon: "headphones" as const,
    title: "Curated with care",
    body: "Every playlist is built and maintained by hand, not by an algorithm. Each one has a clear point of view.",
  },
  {
    icon: "search" as const,
    title: "Built for discovery",
    body: "Mood, genre and activity tags plus full search make it easy to land on exactly the right sound.",
  },
  {
    icon: "trending" as const,
    title: "Always fresh",
    body: "New tracks are added and tired ones are retired every week, so the sound never goes stale.",
  },
];

const socialIcon: Record<string, IconName> = {
  instagram: "instagram",
  twitter: "twitter",
  tiktok: "tiktok",
  spotify: "spotify",
  youtube: "youtube",
};

export default function About() {
  return (
    <>
      <section className="section">
        <div className="container about-hero">
          <div className="about-copy">
            <span className="eyebrow accent">About the hub</span>
            <h1 className="display">We help music find its moment</h1>
            <p>
              Playlist Hub is a curated home for Spotify playlists sorted by
              mood, genre and activity. Instead of digging through endless
              search results, you pick a feeling and press play.
            </p>
            <p>
              What started as a personal collection has grown into a catalogue
              followed by listeners around the world. Every playlist is built to
              soundtrack a real moment, from a focused work session to a full
              dance floor.
            </p>
          </div>
          <div className="about-img">
            <img src={aboutImage} alt="A music studio" />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead
            eyebrow="What we do"
            title="A simple promise, kept every week"
          />
          <div className="value-grid">
            {values.map((v) => (
              <div className="value" key={v.title}>
                <div className="v-ico">
                  <Icon name={v.icon} />
                </div>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="contact" style={{ paddingTop: 0 }}>
        <div className="container">
          <SectionHead
            eyebrow="Get in touch"
            title="Submissions and collaborations welcome"
            desc="Have a track you think fits, or want to work together? Reach out through any of the channels below."
          />

          <div className="contact-cards" style={{ marginBottom: 24 }}>
            <div className="contact-card">
              <div className="cc-ico">
                <Icon name="mail" />
              </div>
              <div className="cc-label">Email</div>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </div>
            <div className="contact-card">
              <div className="cc-ico">
                <Icon name="phone" />
              </div>
              <div className="cc-label">Phone</div>
              <a href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>
                {site.contact.phone}
              </a>
            </div>
            <div className="contact-card">
              <div className="cc-ico">
                <Icon name="location" />
              </div>
              <div className="cc-label">Based</div>
              <p>{site.contact.location}</p>
            </div>
          </div>

          <div className="contact-panel">
            <div>
              <h3>Follow along</h3>
              <p>
                New playlists, fresh drops and behind the scenes picks land on
                social first.
              </p>
            </div>
            <div className="cp-actions">
              <a
                href={site.spotifyProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <Icon name="spotify" />
                Open Spotify profile
              </a>
              <div className="socials">
                {site.social.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                  >
                    <Icon name={socialIcon[s.icon]} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
