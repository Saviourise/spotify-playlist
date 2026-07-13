import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { site } from "../data/site";
import { playlists } from "../data/playlists";
import { GENRES, MOODS } from "../data/types";

const PITCH_MAX = 500;

interface FormState {
  artist: string;
  email: string;
  socialUrl: string;
  trackTitle: string;
  spotifyUrl: string;
  genre: string;
  mood: string;
  releaseStatus: string;
  releaseDate: string;
  playlist: string;
  pitch: string;
  consent: boolean;
}

const initialForm: FormState = {
  artist: "",
  email: "",
  socialUrl: "",
  trackTitle: "",
  spotifyUrl: "",
  genre: "",
  mood: "",
  releaseStatus: "Already released",
  releaseDate: "",
  playlist: "",
  pitch: "",
  consent: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isSpotifyLink = (v: string) => /open\.spotify\.com|spotify:/i.test(v.trim());

const guidelines = [
  "Paste a direct Spotify link to the track you want considered.",
  "Fill in every field. The mood and genre tags help us place your track.",
  "Keep your pitch under 500 characters and tell us what makes it special.",
  "For unreleased music, submit at least a week before the release date.",
];

export default function Submit() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!form.artist.trim()) next.artist = "Please enter your artist name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!isEmail(form.email)) next.email = "Enter a valid email address.";
    if (!form.trackTitle.trim()) next.trackTitle = "Please enter the track title.";
    if (!form.spotifyUrl.trim())
      next.spotifyUrl = "Please paste your Spotify track link.";
    else if (!isSpotifyLink(form.spotifyUrl))
      next.spotifyUrl = "That does not look like a Spotify link (open.spotify.com/...).";
    if (!form.genre) next.genre = "Please pick a genre.";
    if (!form.pitch.trim()) next.pitch = "Tell us a little about the track.";
    else if (form.pitch.length > PITCH_MAX)
      next.pitch = `Please keep your pitch under ${PITCH_MAX} characters.`;
    if (!form.consent)
      next.consent = "Please confirm you have the rights to this track.";
    return next;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = document.querySelector<HTMLElement>(
        ".field.invalid input, .field.invalid select, .field.invalid textarea, .consent.invalid input"
      );
      first?.focus();
      return;
    }
    setStatus("submitting");
    // No backend in this demo build. Simulate a short send, then confirm.
    window.setTimeout(() => setStatus("success"), 700);
  }

  function resetForm() {
    setForm(initialForm);
    setErrors({});
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <div className="section">
        <div className="container">
          <div className="submit-success reveal">
            <div className="ss-badge">
              <Icon name="check-circle" />
            </div>
            <h2>Submission received</h2>
            <p>
              Thanks {form.artist.trim()}. Your track is in the queue and we
              listen to everything that comes in. If it is a fit, we will reach
              out by email.
            </p>
            <div className="ss-recap">
              <div className="ssr-label">Submitted track</div>
              <div className="ssr-value">
                {form.trackTitle.trim()}
                {form.genre ? ` (${form.genre})` : ""}
              </div>
            </div>
            <div className="ss-actions">
              <button className="btn btn-primary" onClick={resetForm}>
                Submit another track
              </button>
              <Link to="/browse" className="btn btn-outline">
                Browse playlists
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pitchLeft = PITCH_MAX - form.pitch.length;

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow accent">Submit a track</span>
          <h1 className="display">Get your music heard</h1>
          <p>
            Pitch your track for a spot on one of our playlists. Submissions are
            free, we read every one, and we reply if it is a fit.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container submit-layout">
          <form className="form-card" onSubmit={onSubmit} noValidate>
            {/* About you */}
            <div className="form-section">
              <div className="fs-head">
                <span className="fs-ix num">01</span>
                <h2 className="fs-title">About you</h2>
              </div>
              <div className="form-grid">
                <div className={`field ${errors.artist ? "invalid" : ""}`}>
                  <label className="field-label" htmlFor="artist">
                    Artist or act name <span className="req">*</span>
                  </label>
                  <input
                    id="artist"
                    className="input"
                    value={form.artist}
                    onChange={(e) => update("artist", e.target.value)}
                    placeholder="e.g. The Midnight Keys"
                  />
                  {errors.artist ? (
                    <span className="field-error">{errors.artist}</span>
                  ) : null}
                </div>

                <div className={`field ${errors.email ? "invalid" : ""}`}>
                  <label className="field-label" htmlFor="email">
                    Email <span className="req">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                  {errors.email ? (
                    <span className="field-error">{errors.email}</span>
                  ) : null}
                </div>

                <div className="field full">
                  <label className="field-label" htmlFor="social">
                    Website or social link <span className="opt">optional</span>
                  </label>
                  <div className="input-icon">
                    <Icon name="link" />
                    <input
                      id="social"
                      className="input"
                      value={form.socialUrl}
                      onChange={(e) => update("socialUrl", e.target.value)}
                      placeholder="instagram.com/yourhandle or your EPK"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Your track */}
            <div className="form-section">
              <div className="fs-head">
                <span className="fs-ix num">02</span>
                <h2 className="fs-title">Your track</h2>
              </div>
              <div className="form-grid">
                <div
                  className={`field full ${
                    errors.spotifyUrl ? "invalid" : ""
                  }`}
                >
                  <label className="field-label" htmlFor="spotify">
                    Spotify track link <span className="req">*</span>
                  </label>
                  <div className="input-icon">
                    <Icon name="spotify" />
                    <input
                      id="spotify"
                      className="input"
                      value={form.spotifyUrl}
                      onChange={(e) => update("spotifyUrl", e.target.value)}
                      placeholder="https://open.spotify.com/track/..."
                    />
                  </div>
                  {errors.spotifyUrl ? (
                    <span className="field-error">{errors.spotifyUrl}</span>
                  ) : (
                    <span className="field-hint">
                      Open the track in Spotify, tap Share, then Copy link.
                    </span>
                  )}
                </div>

                <div className={`field ${errors.trackTitle ? "invalid" : ""}`}>
                  <label className="field-label" htmlFor="track">
                    Track title <span className="req">*</span>
                  </label>
                  <input
                    id="track"
                    className="input"
                    value={form.trackTitle}
                    onChange={(e) => update("trackTitle", e.target.value)}
                    placeholder="Song name"
                  />
                  {errors.trackTitle ? (
                    <span className="field-error">{errors.trackTitle}</span>
                  ) : null}
                </div>

                <div className={`field ${errors.genre ? "invalid" : ""}`}>
                  <label className="field-label" htmlFor="genre">
                    Genre <span className="req">*</span>
                  </label>
                  <select
                    id="genre"
                    className="input"
                    value={form.genre}
                    onChange={(e) => update("genre", e.target.value)}
                  >
                    <option value="">Select a genre</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {errors.genre ? (
                    <span className="field-error">{errors.genre}</span>
                  ) : null}
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="mood">
                    Mood <span className="opt">optional</span>
                  </label>
                  <select
                    id="mood"
                    className="input"
                    value={form.mood}
                    onChange={(e) => update("mood", e.target.value)}
                  >
                    <option value="">Select a mood</option>
                    {MOODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="status">
                    Release status <span className="opt">optional</span>
                  </label>
                  <select
                    id="status"
                    className="input"
                    value={form.releaseStatus}
                    onChange={(e) => update("releaseStatus", e.target.value)}
                  >
                    <option value="Already released">Already released</option>
                    <option value="Upcoming release">Upcoming release</option>
                  </select>
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="date">
                    Release date <span className="opt">optional</span>
                  </label>
                  <input
                    id="date"
                    type="date"
                    className="input"
                    value={form.releaseDate}
                    onChange={(e) => update("releaseDate", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Pitch */}
            <div className="form-section">
              <div className="fs-head">
                <span className="fs-ix num">03</span>
                <h2 className="fs-title">Your pitch</h2>
              </div>
              <div className="form-grid">
                <div className="field full">
                  <label className="field-label" htmlFor="playlist">
                    Target playlist <span className="opt">optional</span>
                  </label>
                  <select
                    id="playlist"
                    className="input"
                    value={form.playlist}
                    onChange={(e) => update("playlist", e.target.value)}
                  >
                    <option value="">No preference, surprise me</option>
                    {playlists.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`field full ${errors.pitch ? "invalid" : ""}`}>
                  <label className="field-label" htmlFor="pitch">
                    Why does it fit? <span className="req">*</span>
                  </label>
                  <textarea
                    id="pitch"
                    className="input"
                    value={form.pitch}
                    maxLength={PITCH_MAX}
                    onChange={(e) => update("pitch", e.target.value)}
                    placeholder="Tell us what the track sounds like, the story behind it, and any momentum such as press, radio or tour dates."
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    {errors.pitch ? (
                      <span className="field-error">{errors.pitch}</span>
                    ) : (
                      <span className="field-hint">
                        A short, specific pitch beats a long one.
                      </span>
                    )}
                    <span className={`char-count ${pitchLeft < 0 ? "over" : ""}`}>
                      {pitchLeft}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Consent + submit */}
            <label className={`consent ${errors.consent ? "invalid" : ""}`}>
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update("consent", e.target.checked)}
              />
              <span>
                I own or control the rights to this track and agree to be
                contacted about this submission.
              </span>
            </label>
            {errors.consent ? (
              <span className="field-error" style={{ marginTop: 8, display: "block" }}>
                {errors.consent}
              </span>
            ) : null}

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending..." : "Submit track"}
                {status === "submitting" ? null : <Icon name="chevron-right" />}
              </button>
              <span className="form-note">
                Free to submit. We reply only if it is a fit.
              </span>
            </div>
          </form>

          <aside className="submit-aside">
            <h3>Before you submit</h3>
            <ul>
              {guidelines.map((g) => (
                <li key={g}>
                  <Icon name="check" />
                  {g}
                </li>
              ))}
            </ul>
            <div className="aside-divider" />
            <div className="aside-contact">
              <div className="ac-label">Prefer email?</div>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
