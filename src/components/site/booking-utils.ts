import { BUSINESS_HOURS, SLOT_MINUTES } from "./site-data";

/* ============================================================
   Calendar + slot utilities for the booking flow.
   Mirrors the logic in the original Express prototype.
   ============================================================ */

export type Slot = {
  /** "HH:mm" 24-hour label, e.g. "10:30" */
  time: string;
  /** Pretty 12-hour label, e.g. "10:30 AM" */
  label: string;
  /** ISO datetime string (local) */
  iso: string;
};

/** Parse "HH:mm" into total minutes since midnight. */
function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Convert total minutes since midnight back to "HH:mm". */
function toHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Format "HH:mm" as a 12-hour label like "1:30 PM". */
export function toLabel(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Get the schedule for a given Date, or null if closed. */
export function getDaySchedule(date: Date): { start: string; end: string } | null {
  const dow = date.getDay().toString();
  return BUSINESS_HOURS[dow] ?? null;
}

/** Generate all 30-min (or SLOT_MINUTES-min) slots for a given date. */
export function generateSlots(date: Date): Slot[] {
  const sched = getDaySchedule(date);
  if (!sched) return [];

  const startMin = toMin(sched.start);
  const endMin = toMin(sched.end);
  const slots: Slot[] = [];

  for (let t = startMin; t + SLOT_MINUTES <= endMin; t += SLOT_MINUTES) {
    const time = toHHMM(t);
    const [y, mo, d] = [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ];
    const iso = new Date(y, mo, d, Math.floor(t / 60), t % 60).toISOString();
    slots.push({ time, label: toLabel(time), iso });
  }

  return slots;
}

/** Returns true if the date is bookable (today or future, and not closed). */
export function isDateBookable(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  if (d < today) return false;
  return getDaySchedule(d) !== null;
}

/** Format a Date as a long-form date string, e.g. "Friday, September 26". */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/** Convert a Date to a YYYY-MM-DD string (for keys / state). */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parse a YYYY-MM-DD string back into a local Date. */
export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Get all days in a given month grid (with leading/trailing blanks for layout). */
export function getMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  // Trailing blanks to fill out a 6-row grid (42 cells) — keeps layout stable
  while (cells.length < 42) cells.push(null);

  return cells;
}
