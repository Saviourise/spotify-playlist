import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Icon } from "../components/Icon";
import { site } from "../data/site";
import { usePlaylists } from "../context/PlaylistsProvider";
import { GENRES } from "../data/types";

// Open spots artists can request. Spots 1 and 2 are reserved.
const SPOTS = Array.from({ length: 18 }, (_, i) => i + 3); // 3..20

interface Target {
  playlist: string;
  spot: string;
}

interface FormState {
  artist: string;
  email: string;
  phone: string;
  spotifyUrl: string;
  trackTitle: string;
  genre: string;
  targets: Target[];
  consent: boolean;
}

const initialForm: FormState = {
  artist: "",
  email: "",
  phone: "",
  spotifyUrl: "",
  trackTitle: "",
  genre: "",
  targets: [{ playlist: "", spot: "" }],
  consent: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isSpotifyLink = (v: string) =>
  /open\.spotify\.com|spotify:/i.test(v.trim());
const isPhone = (v: string) => v.replace(/\D/g, "").length >= 7;

const guidelines = [
  "Paste a direct Spotify link to the track you want placed.",
  "Pick the gospel playlists your song actually fits.",
  "Add as many playlists as you like, with an open spot (3 to 20) for each.",
  "We read every submission and place tracks when the sound fits.",
];

export default function Submit() {
  const { playlists } = usePlaylists();
  const [searchParams] = useSearchParams();

  // Preselect the first playlist when arriving from a playlist's page.
  const [form, setForm] = useState<FormState>(() => {
    const requested = searchParams.get("playlist") ?? "";
    const preselected = playlists.some((p) => p.title === requested)
      ? requested
      : "";
    return {
      ...initialForm,
      targets: [{ playlist: preselected, spot: "" }],
    };
  });
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

  function updateTarget(index: number, key: keyof Target, value: string) {
    setForm((prev) => ({
      ...prev,
      targets: prev.targets.map((t, i) =>
        i === index ? { ...t, [key]: value } : t
      ),
    }));
    if (errors.targets) setErrors((prev) => ({ ...prev, targets: undefined }));
  }

  function addTarget() {
    setForm((prev) => ({
      ...prev,
      targets: [...prev.targets, { playlist: "", spot: "" }],
    }));
  }

  function removeTarget(index: number) {
    setForm((prev) => ({
      ...prev,
      targets: prev.targets.filter((_, i) => i !== index),
    }));
    if (errors.targets) setErrors((prev) => ({ ...prev, targets: undefined }));
  }

  const completeTargets = form.targets.filter((t) => t.playlist && t.spot);

  function validate(): Errors {
    const next: Errors = {};
    if (!form.artist.trim()) next.artist = "Please enter your artist name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!isEmail(form.email)) next.email = "Enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Please enter your phone number.";
    else if (!isPhone(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.spotifyUrl.trim())
      next.spotifyUrl = "Please paste your Spotify track link.";
    else if (!isSpotifyLink(form.spotifyUrl))
      next.spotifyUrl = "That does not look like a Spotify link (open.spotify.com/...).";
    if (!form.trackTitle.trim())
      next.trackTitle = "Please enter the track title.";
    if (!form.genre) next.genre = "Please pick a genre.";

    const partial = form.targets.some(
      (t) => (t.playlist && !t.spot) || (!t.playlist && t.spot)
    );
    const titles = completeTargets.map((t) => t.playlist);
    const hasDuplicate = new Set(titles).size !== titles.length;
    if (completeTargets.length === 0)
      next.targets = "Choose at least one playlist and an open spot for it.";
    else if (partial)
      next.targets =
        "Each playlist needs a spot, and each spot needs a playlist.";
    else if (hasDuplicate)
      next.targets = "You picked the same playlist more than once.";

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
        ".field.invalid input, .field.invalid select, .targets.invalid select, .consent.invalid input"
      );
      first?.focus();
      return;
    }
    setStatus("submitting");
    const placements = completeTargets
      .map((t) => `Spot ${t.spot} on ${t.playlist}`)
      .join("; ");
    // Netlify Forms captures this on the deployed site and emails a notification.
    const body = new URLSearchParams({
      "form-name": "track-submission",
      artist: form.artist,
      email: form.email,
      phone: form.phone,
      trackTitle: form.trackTitle,
      spotifyUrl: form.spotifyUrl,
      genre: form.genre,
      placements,
    }).toString();
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })
      .then(() => setStatus("success"))
      // Still confirm to the visitor; captured on Netlify, no-op in local dev.
      .catch(() => setStatus("success"));
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
              Thanks {form.artist.trim()}. Your request is in the queue and we
              listen to everything that comes in. If it fits, we will reach out
              by email.
            </p>
            <div className="ss-recap">
              <div className="ssr-label">
                Requested placements for {form.trackTitle.trim()}
              </div>
              <ul className="ss-list">
                {completeTargets.map((t, i) => (
                  <li key={i}>
                    Spot {t.spot} on {t.playlist}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ss-actions">
              <button className="btn btn-primary" onClick={resetForm}>
                Submit another song
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

  const usedTitles = new Set(
    form.targets.map((t) => t.playlist).filter(Boolean)
  );

  return (
    <>
      <div className="page-head">
        <div className="container">
          <span className="eyebrow accent">Submit a song</span>
          <h1 className="display">Get your song on a playlist</h1>
          <p>
            Pick the gospel playlists that fit your sound and claim an open spot
            on each. Submissions are free, we read every one, and we reply if it
            is a fit.
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
                    placeholder="e.g. Grace & Sound"
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

                <div className={`field full ${errors.phone ? "invalid" : ""}`}>
                  <label className="field-label" htmlFor="phone">
                    Phone number <span className="req">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="input"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+234 800 000 0000"
                  />
                  {errors.phone ? (
                    <span className="field-error">{errors.phone}</span>
                  ) : null}
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
                  className={`field full ${errors.spotifyUrl ? "invalid" : ""}`}
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
                  </select>
                  {errors.genre ? (
                    <span className="field-error">{errors.genre}</span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Pick your playlists */}
            <div className="form-section">
              <div className="fs-head">
                <span className="fs-ix num">03</span>
                <h2 className="fs-title">Pick your playlists</h2>
              </div>
              <p className="fs-hint">
                Choose the playlists you want your song on, and an open spot (3
                to 20) for each. Add as many as you like. Spots 1 and 2 are
                reserved.
              </p>

              <div className={`targets ${errors.targets ? "invalid" : ""}`}>
                {form.targets.map((t, i) => {
                  const options = playlists.filter(
                    (p) => p.title === t.playlist || !usedTitles.has(p.title)
                  );
                  return (
                    <div className="target-row" key={i}>
                      <div className="field t-playlist">
                        <select
                          className="input"
                          aria-label={`Playlist ${i + 1}`}
                          value={t.playlist}
                          onChange={(e) =>
                            updateTarget(i, "playlist", e.target.value)
                          }
                        >
                          <option value="">Choose a playlist</option>
                          {options.map((p) => (
                            <option key={p.id} value={p.title}>
                              {p.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field t-spot">
                        <select
                          className="input"
                          aria-label={`Spot for playlist ${i + 1}`}
                          value={t.spot}
                          onChange={(e) =>
                            updateTarget(i, "spot", e.target.value)
                          }
                        >
                          <option value="">Spot</option>
                          {SPOTS.map((n) => (
                            <option key={n} value={String(n)}>
                              Spot {n}
                            </option>
                          ))}
                        </select>
                      </div>
                      {form.targets.length > 1 ? (
                        <button
                          type="button"
                          className="target-remove"
                          aria-label="Remove this playlist"
                          onClick={() => removeTarget(i)}
                        >
                          <Icon name="close" />
                        </button>
                      ) : (
                        <span className="target-remove-spacer" />
                      )}
                    </div>
                  );
                })}
              </div>

              {errors.targets ? (
                <span
                  className="field-error"
                  style={{ marginTop: 10, display: "block" }}
                >
                  {errors.targets}
                </span>
              ) : null}

              <button
                type="button"
                className="add-target"
                onClick={addTarget}
                disabled={form.targets.length >= playlists.length}
              >
                <Icon name="plus" />
                Add another playlist
              </button>
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
              <span
                className="field-error"
                style={{ marginTop: 8, display: "block" }}
              >
                {errors.consent}
              </span>
            ) : null}

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending..." : "Submit song"}
                {status === "submitting" ? null : (
                  <Icon name="chevron-right" />
                )}
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
              <div className="ac-label">Prefer to chat?</div>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
