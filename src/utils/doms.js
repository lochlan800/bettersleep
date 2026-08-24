import { differenceInCalendarDays, parseISO } from 'date-fns'

/**
 * DOMS (delayed onset muscle soreness) forecasting.
 *
 * Soreness does not peak on the day you train — it builds overnight, peaks
 * around 48 hours later, then fades over the following few days. The app
 * otherwise only reacts to soreness you have already felt and logged, which
 * is always a day or two behind. This projects it forward so recovery work
 * can be suggested before the worst of it arrives.
 *
 * The curve below is indexed by whole days since the session.
 */
const DOMS_CURVE = [
  0.25, // same day — stiffening has barely started
  0.70, // 24h
  1.00, // 48h — the peak
  0.60, // 72h
  0.30, // 96h
  0.10, // 120h — mostly gone
]

export const DOMS_PEAK_DAY = 2

// Eccentric loading drives muscle damage, so downhill, sprint and strength
// work hurt more later than steady aerobic work at the same effort. Cycling
// is almost entirely concentric and barely produces DOMS at all.
const TYPE_MULTIPLIER = {
  sprints: 1.2,
  strength: 1.2,
  short_intervals: 1.1,
  long_intervals: 1.1,
  easy_long: 1.05,
  park_run: 1.0,
  other: 1.0,
  cycling: 0.65,
  // legacy type names
  easy: 0.9,
  tempo: 1.0,
  interval: 1.1,
  long_run: 1.05,
  race: 1.15,
}

/**
 * How damaging a single session was, 0-1.
 * @param {{intensity?:number, durationMinutes?:number, type?:string}} session
 * @returns {number}
 */
export function getSessionSeverity(session) {
  const intensity = session?.intensity ?? 0
  if (intensity <= 0) return 0
  const typeMult = TYPE_MULTIPLIER[session?.type] ?? 1.0
  const duration = session?.durationMinutes ?? 0
  // Longer sessions accumulate more damage, but with diminishing returns.
  const durationFactor = 0.85 + Math.min(0.3, duration / 200)
  return Math.min(1, (intensity / 10) * typeMult * durationFactor)
}

/**
 * Predicted soreness on a given date from everything trained in the days
 * before it.
 *
 * Sessions overlap: the dominant one sets the level and the rest add a
 * fraction on top, rather than summing outright, which would run away after
 * a heavy block.
 *
 * @param {Array} trainingLogs
 * @param {Date|string} targetDate
 * @returns {{level:number, driver:object|null, daysSinceDriver:number|null}}
 */
export function getDomsOnDate(trainingLogs, targetDate) {
  const target = typeof targetDate === 'string' ? parseISO(targetDate) : targetDate
  const contributions = []

  for (const log of trainingLogs || []) {
    if (!log?.date) continue
    const days = differenceInCalendarDays(target, parseISO(log.date))
    if (days < 0 || days >= DOMS_CURVE.length) continue
    const level = DOMS_CURVE[days] * getSessionSeverity(log) * 100
    if (level > 0) contributions.push({ level, log, days })
  }

  if (contributions.length === 0) {
    return { level: 0, driver: null, daysSinceDriver: null }
  }

  contributions.sort((a, b) => b.level - a.level)
  const top = contributions[0]
  const rest = contributions.slice(1).reduce((sum, c) => sum + c.level * 0.35, 0)

  return {
    level: Math.round(Math.min(100, top.level + rest)),
    driver: top.log,
    daysSinceDriver: top.days,
  }
}

/**
 * Today's predicted soreness plus the next few days, so the app can warn
 * that the worst is still coming.
 *
 * @param {Array} trainingLogs
 * @param {Date} [now]
 * @returns {{
 *   today:number, tomorrow:number,
 *   peakLevel:number, peakInDays:number, peakDate:Date,
 *   driver:object|null, daysSinceDriver:number|null,
 *   rising:boolean, atPeak:boolean, forecast:Array<{daysAhead:number, level:number}>
 * }}
 */
export function getDomsForecast(trainingLogs, now = new Date()) {
  const forecast = []
  for (let d = 0; d <= 4; d++) {
    const date = new Date(now)
    date.setDate(date.getDate() + d)
    forecast.push({ daysAhead: d, level: getDomsOnDate(trainingLogs, date).level, date })
  }

  const todayInfo = getDomsOnDate(trainingLogs, now)
  const peak = forecast.reduce((best, f) => (f.level > best.level ? f : best), forecast[0])

  return {
    today: forecast[0].level,
    tomorrow: forecast[1].level,
    peakLevel: peak.level,
    peakInDays: peak.daysAhead,
    peakDate: peak.date,
    driver: todayInfo.driver,
    daysSinceDriver: todayInfo.daysSinceDriver,
    // Meaningfully worse still to come, rather than a rounding difference.
    rising: peak.daysAhead > 0 && peak.level > forecast[0].level + 5,
    atPeak: peak.daysAhead === 0 && peak.level >= 40,
    forecast,
  }
}

/**
 * Short human description of the forecast.
 * @param {ReturnType<getDomsForecast>} f
 * @returns {string|null}
 */
export function describeDoms(f) {
  if (!f || f.peakLevel < 30) return null
  if (f.rising) {
    const when = f.peakInDays === 1 ? 'tomorrow' : `in ${f.peakInDays} days`
    return `Soreness usually peaks about 48 hours after a session — expect the worst of it ${when}.`
  }
  if (f.atPeak) {
    return 'This is around the 48-hour mark, when soreness typically peaks.'
  }
  if (f.today > 25) return 'Soreness from recent training should be easing now.'
  return null
}
