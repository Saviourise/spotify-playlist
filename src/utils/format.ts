// Number and date formatting helpers used across the hub.

/** Compact display, for example 3120000 becomes "3.1M". */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return trimZero(value / 1_000_000) + "M";
  }
  if (value >= 1_000) {
    return trimZero(value / 1_000) + "K";
  }
  return String(value);
}

function trimZero(value: number): string {
  // One decimal place, but drop it when it is a round number.
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** Full grouped number, for example 3120000 becomes "3,120,000". */
export function formatFull(value: number): string {
  return value.toLocaleString("en-US");
}

/** Minutes to a readable length, for example 296 becomes "4 hr 56 min". */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return mins + " min";
  }
  if (mins === 0) {
    return hours + " hr";
  }
  return hours + " hr " + mins + " min";
}

/** Minutes to whole hours, for example 7680 becomes "128 hrs". */
export function formatHours(minutes: number): string {
  const hours = Math.round(minutes / 60);
  return `${hours.toLocaleString("en-US")} ${hours === 1 ? "hr" : "hrs"}`;
}

/** ISO date to a friendly label, for example "28 Jun 2026". */
export function formatDate(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
