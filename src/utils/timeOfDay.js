/**
 * Clock-time helpers for the routine planners, which both work by counting
 * minutes forwards or backwards from a fixed anchor time.
 */

/**
 * Shift an "HH:mm" time by a number of minutes, wrapping across midnight.
 * @param {string} timeStr - "HH:mm"
 * @param {number} mins - may be negative
 * @returns {string} "HH:mm"
 */
export function addMinutesToTime(timeStr, mins) {
  const [h, m] = timeStr.split(':').map(Number)
  const total = h * 60 + m + mins
  const wrapped = ((total % 1440) + 1440) % 1440
  const th = Math.floor(wrapped / 60)
  const tm = wrapped % 60
  return `${String(th).padStart(2, '0')}:${String(tm).padStart(2, '0')}`
}

/**
 * Render "HH:mm" as a 12-hour time, e.g. "9:30 pm".
 * @param {string} timeStr - "HH:mm"
 * @returns {string}
 */
export function formatTime12(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}
