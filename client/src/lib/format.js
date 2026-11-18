const LOCALE = 'en-GB';

const rangeFormat = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const monthFormat = new Intl.DateTimeFormat(LOCALE, {month: 'short'});
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * @param {string | number | Date | null | undefined} value
 * @returns {Date | null}
 */
function toDate(value) {
  if (value === null || value === undefined || value === '') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * "12–20 Jan 2020", or a single date when only one end is known.
 * @param {string | number | Date | null | undefined} start
 * @param {string | number | Date | null | undefined} end
 */
export function formatDateRange(start, end) {
  const from = toDate(start);
  const to = toDate(end);
  if (from && to) return rangeFormat.formatRange(from, to);
  const single = from ?? to;
  return single ? rangeFormat.format(single) : 'Date to be announced';
}

/**
 * @param {string | number | Date | null | undefined} value
 */
export function dateBadge(value) {
  const date = toDate(value);
  if (!date) return {month: 'TBA', day: '–'};
  return {month: monthFormat.format(date), day: String(date.getDate())};
}

/**
 * Number of calendar days an event spans (inclusive), or null when unknown.
 * @param {string | number | Date | null | undefined} start
 * @param {string | number | Date | null | undefined} end
 */
export function dayCount(start, end) {
  const from = toDate(start);
  const to = toDate(end);
  if (!from || !to) return null;
  return Math.max(1, Math.round((to.getTime() - from.getTime()) / DAY_MS) + 1);
}

/**
 * @param {number} n
 * @param {string} word
 * @param {string} [many]
 */
export function plural(n, word, many = `${word}s`) {
  return `${n} ${n === 1 ? word : many}`;
}

/**
 * Seed titles end with a full stop; headings look cleaner without it.
 * @param {string | null | undefined} value
 */
export function cleanTitle(value) {
  return (value ?? '').replace(/\.\s*$/, '');
}

/** @param {string | null | undefined} level */
export function levelClass(level) {
  const key = (level ?? '').toLowerCase();
  return ['junior', 'intermediate', 'senior'].includes(key)
    ? `level-${key}`
    : '';
}

/**
 * @param {string} query
 * @param {Array<string | null | undefined>} fields
 */
export function matches(query, fields) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some(field => (field ?? '').toLowerCase().includes(q));
}

/**
 * Value for <input type="date">. Dates are stored at noon UTC, so the UTC
 * calendar day is the day the user picked.
 * @param {string | number | Date | null | undefined} value
 */
export function toDateInput(value) {
  const date = toDate(value);
  return date ? date.toISOString().slice(0, 10) : '';
}

/**
 * ISO timestamp (noon UTC) for a "YYYY-MM-DD" value from <input type="date">.
 * @param {string} value
 */
export function fromDateInput(value) {
  return `${value}T12:00:00.000Z`;
}
