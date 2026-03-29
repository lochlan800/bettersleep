import { differenceInCalendarDays, parseISO } from 'date-fns';

/**
 * Parse "HH:mm" time string into hours and minutes.
 */
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Get sleep duration in hours, handling midnight crossing.
 * @param {string} bedtime - "HH:mm" format
 * @param {string} wakeTime - "HH:mm" format
 * @returns {number} duration in hours
 */
export function getSleepDurationHours(bedtime, wakeTime) {
  const bed = parseTime(bedtime);
  const wake = parseTime(wakeTime);

  let bedMinutes = bed.hours * 60 + bed.minutes;
  let wakeMinutes = wake.hours * 60 + wake.minutes;

  // Handle midnight crossing: if wake is earlier than bed, add 24h to wake
  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60;
  }

  return (wakeMinutes - bedMinutes) / 60;
}

/**
 * Calculate a sleep score from 0-100.
 * @param {{ bedtime: string, wakeTime: string, qualityRating: number }} sleepLog
 * @param {Array} recentLogs - last 7 sleep logs for consistency calculation
 * @returns {number} score 0-100
 */
export function calculateSleepScore(sleepLog, recentLogs = []) {
  const duration = getSleepDurationHours(sleepLog.bedtime, sleepLog.wakeTime);

  // Duration score (0-40)
  let durationScore = 0;
  if (duration >= 7 && duration <= 9) {
    durationScore = 40;
  } else if (duration >= 6 && duration < 7) {
    durationScore = 25;
  } else if (duration >= 5 && duration < 6) {
    durationScore = 15;
  } else if (duration > 9) {
    // Oversleeping still counts but slightly less
    durationScore = 30;
  } else {
    durationScore = 0;
  }

  // Quality score (0-35)
  const qualityScore = (sleepLog.qualityRating / 5) * 35;

  // Consistency score (0-25)
  let consistencyScore = 25;
  if (recentLogs.length >= 2) {
    const bedtimeMinutes = recentLogs.map((log) => {
      const t = parseTime(log.bedtime);
      let mins = t.hours * 60 + t.minutes;
      // Normalize so late night times (e.g. 23:00) and early morning (00:30)
      // are close together: shift times after noon down by 24h
      if (mins > 12 * 60) {
        mins -= 24 * 60;
      }
      return mins;
    });

    const mean =
      bedtimeMinutes.reduce((sum, m) => sum + m, 0) / bedtimeMinutes.length;
    const variance =
      bedtimeMinutes.reduce((sum, m) => sum + Math.pow(m - mean, 2), 0) /
      bedtimeMinutes.length;
    const stdDev = Math.sqrt(variance); // in minutes

    // Low stdDev (< 15 min) = full score, high stdDev (> 90 min) = 0
    if (stdDev <= 15) {
      consistencyScore = 25;
    } else if (stdDev >= 90) {
      consistencyScore = 0;
    } else {
      consistencyScore = Math.round(25 * (1 - (stdDev - 15) / 75));
    }
  }

  return Math.round(
    Math.min(100, Math.max(0, durationScore + qualityScore + consistencyScore))
  );
}

/**
 * Calculate training load for a single session.
 * @param {number} durationMinutes
 * @param {number} intensity - 1-10 scale
 * @returns {number}
 */
export function calculateTrainingLoad(durationMinutes, intensity) {
  return durationMinutes * intensity;
}

/**
 * Calculate acute training load (last 7 days).
 * @param {Array<{ date: string, durationMinutes: number, intensity: number }>} trainingLogs
 * @returns {number}
 */
export function calculateAcuteLoad(trainingLogs) {
  const today = new Date();
  const recentLogs = trainingLogs.filter((log) => {
    const logDate = parseISO(log.date);
    const daysAgo = differenceInCalendarDays(today, logDate);
    return daysAgo >= 0 && daysAgo < 7;
  });

  return recentLogs.reduce((sum, log) => {
    return sum + calculateTrainingLoad(log.durationMinutes, log.intensity);
  }, 0);
}

/**
 * Calculate chronic training load (average weekly load over last 28 days).
 * @param {Array<{ date: string, durationMinutes: number, intensity: number }>} trainingLogs
 * @returns {number}
 */
export function calculateChronicLoad(trainingLogs) {
  const today = new Date();
  const last28 = trainingLogs.filter((log) => {
    const logDate = parseISO(log.date);
    const daysAgo = differenceInCalendarDays(today, logDate);
    return daysAgo >= 0 && daysAgo < 28;
  });

  const totalLoad = last28.reduce((sum, log) => {
    return sum + calculateTrainingLoad(log.durationMinutes, log.intensity);
  }, 0);

  // Average weekly load = total load / 4 weeks
  return totalLoad / 4;
}

/**
 * Calculate Acute:Chronic Workload Ratio.
 * @param {Array} trainingLogs
 * @returns {number}
 */
export function calculateACWR(trainingLogs) {
  const chronic = calculateChronicLoad(trainingLogs);
  if (chronic === 0) {
    return 0;
  }
  const acute = calculateAcuteLoad(trainingLogs);
  return acute / chronic;
}

/**
 * Map ACWR to a fatigue score 0-100.
 * 0.8-1.3 is the safe zone, >1.5 is danger.
 * @param {number} acwr
 * @returns {number} 0-100
 */
export function calculateFatigueScore(acwr) {
  if (acwr === 0) {
    return 0;
  }

  if (acwr >= 0.8 && acwr <= 1.3) {
    // Safe zone: low fatigue (10-40)
    const t = (acwr - 0.8) / 0.5; // 0 to 1 within safe zone
    return Math.round(10 + t * 30);
  } else if (acwr < 0.8) {
    // Under-training / detraining: low fatigue
    return Math.round(Math.max(0, acwr * 12.5));
  } else if (acwr > 1.3 && acwr <= 1.5) {
    // Warning zone (40-70)
    const t = (acwr - 1.3) / 0.2;
    return Math.round(40 + t * 30);
  } else {
    // Danger zone (70-100)
    const t = Math.min(1, (acwr - 1.5) / 0.5);
    return Math.round(70 + t * 30);
  }
}

/**
 * Calculate daily hydration target in ml.
 * @param {number} bodyWeightKg
 * @param {number} todayTrainingMinutes
 * @returns {number} target in ml
 */
export function calculateHydrationTarget(bodyWeightKg, todayTrainingMinutes) {
  const base = bodyWeightKg * 35;
  const trainingHours = todayTrainingMinutes / 60;
  const trainingExtra = trainingHours * 500;
  return Math.round(base + trainingExtra);
}

/**
 * Calculate overall recovery score 0-100.
 * Weights adjust dynamically based on available data — ACWR only counts
 * when there is enough training history (>= 14 days with a non-zero
 * chronic load) to make the ratio meaningful.
 *
 * @param {{ sleepScore: number, fatigueScore: number, hydrationPercent: number, sorenessLevel: number, hasReliableACWR: boolean }} params
 * @returns {number} 0-100
 */
export function calculateRecoveryScore({
  sleepScore,
  fatigueScore,
  hydrationPercent,
  sorenessLevel,
  hasReliableACWR,
}) {
  // Dynamic weights: redistribute fatigue weight when ACWR isn't reliable
  let wSleep, wFatigue, wHydration, wSoreness;
  if (hasReliableACWR) {
    wSleep = 35;
    wFatigue = 30;
    wHydration = 15;
    wSoreness = 20;
  } else {
    // No reliable ACWR — drop fatigue, redistribute to sleep and soreness
    wSleep = 45;
    wFatigue = 0;
    wHydration = 20;
    wSoreness = 35;
  }

  const sleepComponent = (sleepScore / 100) * wSleep;
  const fatigueComponent = wFatigue > 0 ? ((100 - fatigueScore) / 100) * wFatigue : 0;
  const cappedHydration = Math.min(100, hydrationPercent);
  const hydrationComponent = (cappedHydration / 100) * wHydration;
  const sorenessNormalized = (5 - sorenessLevel) / 4; // 1->1.0, 5->0.0
  const sorenessComponent = sorenessNormalized * wSoreness;

  return Math.round(
    Math.min(
      100,
      Math.max(
        0,
        sleepComponent + fatigueComponent + hydrationComponent + sorenessComponent
      )
    )
  );
}
