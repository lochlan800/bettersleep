import {
  format,
  parseISO,
  isToday as fnsIsToday,
  subDays,
  parse,
} from 'date-fns';

/**
 * Format a date string as "Mar 28".
 * @param {string} dateStr - "YYYY-MM-DD" format
 * @returns {string}
 */
export function formatDate(dateStr) {
  const date = parseISO(dateStr);
  return format(date, 'MMM d');
}

/**
 * Format a time string as "10:30 PM".
 * @param {string} timeStr - "HH:mm" format (24-hour)
 * @returns {string}
 */
export function formatTime(timeStr) {
  const date = parse(timeStr, 'HH:mm', new Date());
  return format(date, 'h:mm a');
}

/**
 * Get today's date as "YYYY-MM-DD".
 * @returns {string}
 */
export function getToday() {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Get the date N days ago as "YYYY-MM-DD".
 * @param {number} n - number of days ago
 * @returns {string}
 */
export function getDaysAgo(n) {
  return format(subDays(new Date(), n), 'yyyy-MM-dd');
}

/**
 * Check if a date string is today.
 * @param {string} dateStr - "YYYY-MM-DD" format
 * @returns {boolean}
 */
export function isToday(dateStr) {
  return fnsIsToday(parseISO(dateStr));
}
