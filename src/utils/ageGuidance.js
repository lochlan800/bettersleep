/**
 * Age-appropriate guidance.
 *
 * Recovery advice written for adults is not automatically safe or accurate
 * for a 13-year-old. Sleep need is the clearest example — a teenager
 * sleeping 7 hours is under-slept, while for an adult that is fine — but
 * caffeine, cold water immersion, and training load all differ too.
 *
 * Sleep figures follow the American Academy of Sleep Medicine / NHS
 * consensus ranges.
 */

export const AGE_BANDS = {
  CHILD: 'child',       // 6-12
  TEEN: 'teen',         // 13-17
  YOUNG_ADULT: 'youngAdult', // 18-25
  ADULT: 'adult',       // 26-64
  OLDER_ADULT: 'olderAdult', // 65+
}

/**
 * Classify an age into a guidance band. Unknown age is treated as adult,
 * which is the safest default for scoring but means the app should ask.
 * @param {number|null} age
 * @returns {string}
 */
export function getAgeBand(age) {
  if (!age || age <= 0) return AGE_BANDS.ADULT
  if (age < 13) return AGE_BANDS.CHILD
  if (age < 18) return AGE_BANDS.TEEN
  if (age < 26) return AGE_BANDS.YOUNG_ADULT
  if (age < 65) return AGE_BANDS.ADULT
  return AGE_BANDS.OLDER_ADULT
}

const SLEEP_NEED = {
  [AGE_BANDS.CHILD]:       { min: 9,   ideal: 10,  max: 12, label: '9-12 hours' },
  [AGE_BANDS.TEEN]:        { min: 8,   ideal: 9,   max: 10, label: '8-10 hours' },
  [AGE_BANDS.YOUNG_ADULT]: { min: 7,   ideal: 8.5, max: 9,  label: '7-9 hours' },
  [AGE_BANDS.ADULT]:       { min: 7,   ideal: 8,   max: 9,  label: '7-9 hours' },
  [AGE_BANDS.OLDER_ADULT]: { min: 7,   ideal: 7.5, max: 8,  label: '7-8 hours' },
}

/**
 * Nightly sleep the person actually needs.
 * @param {number|null} age
 * @returns {{min:number, ideal:number, max:number, label:string}}
 */
export function getSleepNeed(age) {
  return SLEEP_NEED[getAgeBand(age)]
}

/**
 * Whether caffeine advice should be shown at all.
 * Under-18s are advised to limit or avoid caffeine, so tips about timing a
 * coffee or using a "coffee nap" are the wrong message to give them.
 * @param {number|null} age
 * @returns {boolean}
 */
export function caffeineAppropriate(age) {
  const band = getAgeBand(age)
  return band !== AGE_BANDS.CHILD && band !== AGE_BANDS.TEEN
}

/**
 * Whether a recovery strategy suits this age.
 * Strategies declare `minAge` and/or `notFor` bands; anything unmarked
 * applies to everyone.
 * @param {{minAge?:number, notFor?:string[]}} strategy
 * @param {number|null} age
 * @returns {boolean}
 */
export function strategyAppropriate(strategy, age) {
  if (!strategy) return true
  const band = getAgeBand(age)
  if (strategy.notFor && strategy.notFor.includes(band)) return false
  // With no age set we still show everything, but the caution note renders.
  if (strategy.minAge && age && age < strategy.minAge) return false
  return true
}

/**
 * Extra caution text for a strategy at this age, or null.
 * @param {{cautionUnder?:{age:number, text:string}}} strategy
 * @param {number|null} age
 * @returns {string|null}
 */
export function strategyCaution(strategy, age) {
  if (!strategy?.cautionUnder) return null
  if (!age) return strategy.cautionUnder.text
  return age < strategy.cautionUnder.age ? strategy.cautionUnder.text : null
}

/**
 * Rest days per week that suit this age. Young athletes are still growing
 * and their growth plates are more vulnerable to overuse, so the floor is
 * higher than for adults.
 * @param {number|null} age
 * @returns {{restDays:number, maxConsecutive:number, note:string}}
 */
export function getTrainingGuidance(age) {
  const band = getAgeBand(age)
  if (band === AGE_BANDS.CHILD) {
    return {
      restDays: 3,
      maxConsecutive: 2,
      note: 'Still growing — at least 2-3 rest days a week and plenty of variety. Growth plates are more vulnerable to overuse than adult bone.',
    }
  }
  if (band === AGE_BANDS.TEEN) {
    return {
      restDays: 2,
      maxConsecutive: 3,
      note: 'Still growing — aim for at least 2 rest days a week. Growth spurts raise injury risk, so back off when something aches rather than pushing through.',
    }
  }
  if (band === AGE_BANDS.OLDER_ADULT) {
    return {
      restDays: 2,
      maxConsecutive: 3,
      note: 'Recovery slows with age — allow an extra easy day between hard sessions.',
    }
  }
  return {
    restDays: 1,
    maxConsecutive: 5,
    note: 'Aim for at least 1 full rest day per week.',
  }
}

/**
 * Human-readable label for the band, used in UI copy.
 * @param {number|null} age
 * @returns {string}
 */
export function getAgeBandLabel(age) {
  switch (getAgeBand(age)) {
    case AGE_BANDS.CHILD: return 'under 13'
    case AGE_BANDS.TEEN: return 'teen'
    case AGE_BANDS.YOUNG_ADULT: return 'young adult'
    case AGE_BANDS.OLDER_ADULT: return '65+'
    default: return 'adult'
  }
}
