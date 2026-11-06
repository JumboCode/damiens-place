/**
 * time-conversion.ts
 *
 * Helpers for converting between the pantry's local time and UTC. The database
 * stores everything in UTC, but the pantry thinks in local time, so every date,
 * time, and month in the app goes through here
 *
 * Author: Natalie Phua
 * Date Created: 11/5/2026
 */

export const PANTRY_TIMEZONE = "America/New_York";

const PARTS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: PANTRY_TIMEZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * pantryParts
 *
 * Splits a moment into the year, month (1-12), day, hour (0-23), and minute
 *
 * @param value - a Date, or an ISO string
 * @throws RangeError if the value isn't a real date
 */
function pantryParts(value: Date | string) {
  const parts = PARTS_FORMATTER.formatToParts(new Date(value));
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    // Some runtimes write midnight as 24, so fold it back to 0
    hour: get("hour") % 24,
    minute: get("minute"),
  };
}

/**
 * pantryOffsetMs
 *
 * How far the pantry's wall clock is ahead of UTC at a moment, in milliseconds
 * (negative for Eastern time)
 *
 * @param utcMs - a moment, in milliseconds since 1970
 */
function pantryOffsetMs(utcMs: number): number {
  const p = pantryParts(new Date(utcMs));
  const localAsUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  // Drop the seconds, because the wall-clock parts have none
  return localAsUtc - Math.floor(utcMs / 60000) * 60000;
}

/**
 * pantryDateTimeToUtc
 *
 * Turns a date and time on the pantry's wall clock (what the Log Hours form
 * sends) into the UTC moment to store
 *
 * @param date - "YYYY-MM-DD"
 * @param time - 24-hour "HH:mm"
 * @returns the UTC Date, or null if the date or time isn't valid
 */
export function pantryDateTimeToUtc(date: string, time: string): Date | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const t = /^(\d{2}):(\d{2})$/.exec(time);
  if (!d || !t) return null;

  const [year, month, day] = [Number(d[1]), Number(d[2]), Number(d[3])];
  const [hour, minute] = [Number(t[1]), Number(t[2])];
  if (hour > 23 || minute > 59) return null;

  // Reject dates that roll over, like February 30
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    return null;
  }

  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  const first = asUtc - pantryOffsetMs(asUtc);
  const second = asUtc - pantryOffsetMs(first);

  const back = pantryParts(new Date(second));
  const readsBack = back.hour === hour && back.minute === minute;
  return new Date(readsBack ? second : first);
}

/**
 * formatPantry
 *
 * Formats a moment in the pantry's timezone the way the Figma shows it, like
 * "09/21/2026 04:05PM".
 *
 * @param value - a Date, or an ISO string
 * @throws RangeError if the value isn't a real date
 */
export function formatPantry(value: Date | string): string {
  const p = pantryParts(value);
  const time = `${pad(p.hour % 12 || 12)}:${pad(p.minute)}${p.hour < 12 ? "AM" : "PM"}`;
  return `${pad(p.month)}/${pad(p.day)}/${p.year} ${time}`;
}

/**
 * pantryMonthKey
 *
 * Gives the month a moment falls in on the pantry's calendar, as "YYYY-MM"
 *
 * @param value - a Date, or an ISO string
 * @throws RangeError if the value isn't a real date
 */
export function pantryMonthKey(value: Date | string): string {
  const p = pantryParts(value);
  return `${p.year}-${pad(p.month)}`;
}

/**
 * pantryMonthRange
 *
 * Gives the UTC moments a pantry month starts and ends at, for database
 * queries like "hours logged in September". The start is included and the end
 * is not: use `gte: start, lt: end`.
 *
 * @param month - "YYYY-MM"
 * @returns { start, end }, or null if the month isn't valid
 */
export function pantryMonthRange(
  month: string,
): { start: Date; end: Date } | null {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return null;

  const start = pantryDateTimeToUtc(`${month}-01`, "00:00");
  const end = pantryDateTimeToUtc(`${shiftMonth(month, 1)}-01`, "00:00");
  return start && end ? { start, end } : null;
}

/**
 * shiftMonth
 *
 * Moves a month forward or back, across year ends, for the month selector.
 *
 * @param month - "YYYY-MM"
 * @param delta - months to move (negative goes back)
 */
export function shiftMonth(month: string, delta: number): string {
  const [year, m] = month.split("-").map(Number);
  const moved = new Date(Date.UTC(year, m - 1 + delta, 1));
  return `${moved.getUTCFullYear()}-${pad(moved.getUTCMonth() + 1)}`;
}

/**
 * formatMonth
 *
 * The label the month selector shows, like "Sep 2026".
 *
 * @param month - "YYYY-MM"
 */
export function formatMonth(month: string): string {
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
