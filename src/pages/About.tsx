import { SectionHead } from "../components/SectionHead";
import { Icon, type IconName } from "../components/Icon";
import { site, whatsappUrl } from "../data/site";

const aboutImage = "/eseosa-gnf.jpg";

const values = [
  {
    icon: "headphones" as const,
    title: "Curated with care",
    body: "Every gospel playlist is built and maintained by hand, not by an algorithm. Each one has a clear point of view.",
  },
  {
    icon: "search" as const,
    title: "Built for discovery",
    body: "Genre tags and full search make it easy to land on exactly the right playlist for the moment.",
  },
  {
    icon: "trending" as const,
    title: "Always fresh",
    body: "New songs are added and tired ones retired every week, with saves updating live from Spotify.",
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
            <span className="eyebrow accent">About {site.name}</span>
            <h1 className="display">Curating the sound of gospel</h1>
            <p>
              {site.name} is a passionate playlist curator, dedicated to
              helping music lovers discover the perfect soundtrack for every
              mood, moment and lifestyle. With Jesus as the focus.
            </p>
            <p>
              Driven by a keen ear for quality music and an understanding of
              listener preferences, {site.name} curates playlists that balance
              popular hits, hidden gems and emerging artists. Every playlist is
              thoughtfully arranged to deliver a seamless listening journey,
              whether the goal is worship, praise, studying, or simply
              discovering new music.
            </p>
            <p>
              Beyond curation, {site.name} is committed to supporting both
              established and independent artists by connecting their music with
              the right audiences. Through consistency, attention to detail and
              a genuine passion for music discovery, the brand has become a
              trusted destination for listeners seeking playlists that match
              their taste and introduce them to fresh sounds.
            </p>
            <p>
              It is also a home for artists. Find the playlist your song belongs
              on, claim an open spot, and reach listeners who are already
              worshipping to this sound.
            </p>
          </div>
          <div className="about-img">
            <img src={aboutImage} alt={`${site.name}`} />
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
            desc="Have a song you think fits, or want to work together? Reach out through any of the channels below."
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
                <Icon name="whatsapp" />
              </div>
              <div className="cc-label">WhatsApp</div>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                {site.contact.whatsapp}
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
