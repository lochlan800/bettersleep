import { parseISO, differenceInCalendarDays, differenceInHours } from 'date-fns';
import { getSleepDurationHours, calculateACWR } from './scoring';

/**
 * Get sleep-related recommendations.
 * @param {Array<{ date: string, bedtime: string, wakeTime: string, qualityRating: number }>} sleepLogs
 * @param {Array<{ date: string, durationMinutes: number, intensity: number, runType?: string }>} trainingLogs
 * @returns {Array<{ category: string, priority: string, text: string }>}
 */
export function getSleepRecommendations(sleepLogs, trainingLogs) {
  const recommendations = [];

  if (sleepLogs.length === 0) {
    recommendations.push({
      category: 'sleep',
      priority: 'medium',
      text: 'Start logging your sleep to get personalized recommendations for better recovery.',
    });
    return recommendations;
  }

  // Check average duration over recent logs
  const recentSleep = sleepLogs.slice(-7);
  const avgDuration =
    recentSleep.reduce(
      (sum, log) => sum + getSleepDurationHours(log.bedtime, log.wakeTime),
      0
    ) / recentSleep.length;

  if (avgDuration < 7) {
    recommendations.push({
      category: 'sleep',
      priority: 'high',
      text: `Your average sleep is ${avgDuration.toFixed(1)} hours. Aim for 7-9 hours per night to optimize recovery and performance.`,
    });
  }

  // Check bedtime variance
  if (recentSleep.length >= 3) {
    const bedtimeMinutes = recentSleep.map((log) => {
      const [h, m] = log.bedtime.split(':').map(Number);
      let mins = h * 60 + m;
      if (mins > 12 * 60) mins -= 24 * 60;
      return mins;
    });

    const mean = bedtimeMinutes.reduce((a, b) => a + b, 0) / bedtimeMinutes.length;
    const variance =
      bedtimeMinutes.reduce((sum, m) => sum + Math.pow(m - mean, 2), 0) /
      bedtimeMinutes.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev > 45) {
      recommendations.push({
        category: 'sleep',
        priority: 'medium',
        text: 'Your bedtime varies by over 45 minutes. Try to go to bed within a 30-minute window each night to improve sleep quality and circadian rhythm.',
      });
    }
  }

  // Check if heavy training yesterday
  const today = new Date();
  const yesterdayLogs = trainingLogs.filter((log) => {
    const daysAgo = differenceInCalendarDays(today, parseISO(log.date));
    return daysAgo === 1;
  });

  const hadHeavyTraining = yesterdayLogs.some((log) => log.intensity >= 7);
  if (hadHeavyTraining) {
    recommendations.push({
      category: 'sleep',
      priority: 'high',
      text: 'You had a high-intensity training session yesterday. Try to get an extra 30 minutes of sleep tonight to support muscle repair and adaptation.',
    });
  }

  // Quality-based recommendation
  const avgQuality =
    recentSleep.reduce((sum, log) => sum + log.qualityRating, 0) /
    recentSleep.length;

  if (avgQuality < 3) {
    recommendations.push({
      category: 'sleep',
      priority: 'medium',
      text: 'Your sleep quality has been low. Consider limiting screen time 1 hour before bed, keeping your room cool (65-68F), and avoiding caffeine after 2 PM.',
    });
  }

  return recommendations.slice(0, 4);
}

/**
 * Get nutrition-related recommendations.
 * @param {{ date: string, durationMinutes: number, intensity: number } | null} lastTraining
 * @param {number} todayHydration - ml consumed today
 * @param {number} hydrationTarget - ml target for today
 * @returns {Array<{ category: string, priority: string, text: string }>}
 */
export function getNutritionRecommendations(
  lastTraining,
  todayHydration,
  hydrationTarget
) {
  const recommendations = [];

  // Hydration deficit
  const hydrationPercent = hydrationTarget > 0
    ? (todayHydration / hydrationTarget) * 100
    : 100;

  if (hydrationPercent < 50) {
    recommendations.push({
      category: 'nutrition',
      priority: 'high',
      text: `You have consumed only ${Math.round(hydrationPercent)}% of your hydration target. Drink ${Math.round((hydrationTarget - todayHydration) / 1000 * 10) / 10}L more today to stay properly hydrated.`,
    });
  } else if (hydrationPercent < 80) {
    recommendations.push({
      category: 'nutrition',
      priority: 'medium',
      text: `You are at ${Math.round(hydrationPercent)}% of your hydration goal. Keep sipping water throughout the day to reach your target of ${(hydrationTarget / 1000).toFixed(1)}L.`,
    });
  }

  if (!lastTraining) {
    recommendations.push({
      category: 'nutrition',
      priority: 'low',
      text: 'On rest days, focus on whole foods rich in antioxidants and anti-inflammatory nutrients to support recovery.',
    });
    return recommendations.slice(0, 4);
  }

  // Training intensity-based meal suggestions
  const hoursSinceTraining = differenceInHours(
    new Date(),
    parseISO(lastTraining.date)
  );

  if (lastTraining.intensity >= 7) {
    recommendations.push({
      category: 'nutrition',
      priority: 'high',
      text: 'After your high-intensity session, prioritize a meal with 30-40g protein and 60-80g carbs within 2 hours. Try grilled chicken with rice and vegetables.',
    });
  } else if (lastTraining.intensity >= 4) {
    recommendations.push({
      category: 'nutrition',
      priority: 'medium',
      text: 'After your moderate session, have a balanced meal with 20-30g protein and 40-60g carbs. A salmon bowl with quinoa and greens is a great option.',
    });
  } else {
    recommendations.push({
      category: 'nutrition',
      priority: 'low',
      text: 'After your easy session, a light snack with 15-20g protein is sufficient. Try Greek yogurt with berries and a handful of nuts.',
    });
  }

  // Protein window
  if (hoursSinceTraining <= 2 && hoursSinceTraining >= 0) {
    recommendations.push({
      category: 'nutrition',
      priority: 'high',
      text: 'You are within the optimal protein synthesis window. Consume 20-40g of quality protein now to maximize muscle repair and adaptation.',
    });
  }

  return recommendations.slice(0, 4);
}

/**
 * Get recovery-related recommendations.
 * @param {{ date: string, durationMinutes: number, intensity: number, sorenessLevel?: number, runType?: string } | null} lastTraining
 * @param {Array} trainingLogs
 * @param {number} acwr - Acute:Chronic Workload Ratio
 * @returns {Array<{ category: string, priority: string, text: string }>}
 */
export function getRecoveryRecommendations(lastTraining, trainingLogs, acwr) {
  const recommendations = [];

  // ACWR-based warning
  if (acwr > 1.5) {
    recommendations.push({
      category: 'recovery',
      priority: 'high',
      text: `Your training load ratio is ${acwr.toFixed(2)}, which is in the danger zone (>1.5). Take a rest day or do very light activity to reduce injury risk.`,
    });
  } else if (acwr > 1.3) {
    recommendations.push({
      category: 'recovery',
      priority: 'medium',
      text: `Your training load ratio is ${acwr.toFixed(2)}. You are approaching the danger zone. Consider reducing intensity over the next few days.`,
    });
  }

  // Days since rest
  if (trainingLogs.length > 0) {
    const today = new Date();
    const sortedLogs = [...trainingLogs]
      .filter((log) => differenceInCalendarDays(today, parseISO(log.date)) >= 0)
      .sort(
        (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
      );

    let consecutiveDays = 0;
    for (let i = 0; i < sortedLogs.length; i++) {
      const daysAgo = differenceInCalendarDays(today, parseISO(sortedLogs[i].date));
      if (daysAgo === consecutiveDays) {
        consecutiveDays++;
      } else {
        break;
      }
    }

    if (consecutiveDays > 3) {
      recommendations.push({
        category: 'recovery',
        priority: 'high',
        text: `You have trained ${consecutiveDays} days in a row. Schedule a rest day to allow your body to recover and adapt to the training stimulus.`,
      });
    }
  }

  // Soreness-based recommendations
  if (lastTraining && lastTraining.sorenessLevel) {
    const soreness = lastTraining.sorenessLevel;
    if (soreness <= 2) {
      recommendations.push({
        category: 'recovery',
        priority: 'low',
        text: 'Light soreness detected. A gentle 10-15 minute stretching routine will help maintain flexibility and promote blood flow.',
      });
    } else if (soreness === 3) {
      recommendations.push({
        category: 'recovery',
        priority: 'medium',
        text: 'Moderate soreness detected. Spend 15-20 minutes foam rolling the affected areas followed by light stretching to speed up recovery.',
      });
    } else {
      recommendations.push({
        category: 'recovery',
        priority: 'high',
        text: 'High soreness detected. Use ice for 15 minutes on sore areas, followed by heat therapy after 24 hours. Prioritize rest and avoid intense training.',
      });
    }
  }

  // Run type-specific muscle focus
  if (lastTraining && lastTraining.runType) {
    const muscleMap = {
      easy: 'Focus on calf and hip flexor stretches after your easy run.',
      tempo: 'After your tempo run, prioritize hamstring and quad recovery with foam rolling and stretching.',
      interval: 'Interval sessions tax your calves and achilles. Do targeted stretching and consider compression socks.',
      long: 'After your long run, focus on IT band, glutes, and hip flexor recovery. An ice bath can help reduce inflammation.',
      hill: 'Hill repeats heavily load your calves and glutes. Spend extra time foam rolling these areas.',
      recovery: 'Great job taking it easy. Light stretching is all you need after a recovery run.',
    };

    const tip = muscleMap[lastTraining.runType];
    if (tip) {
      recommendations.push({
        category: 'recovery',
        priority: 'low',
        text: tip,
      });
    }
  }

  return recommendations.slice(0, 4);
}

/**
 * Get all recommendations combined.
 * @param {Array} sleepLogs
 * @param {Array} trainingLogs
 * @param {number} todayHydration
 * @param {number} hydrationTarget
 * @returns {Array<{ category: string, priority: string, text: string }>}
 */
export function getAllRecommendations(
  sleepLogs,
  trainingLogs,
  todayHydration,
  hydrationTarget
) {
  const today = new Date();
  const sortedTraining = [...trainingLogs].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );
  const lastTraining = sortedTraining.length > 0 ? sortedTraining[0] : null;
  const acwr = calculateACWR(trainingLogs);

  const sleep = getSleepRecommendations(sleepLogs, trainingLogs);
  const nutrition = getNutritionRecommendations(
    lastTraining,
    todayHydration,
    hydrationTarget
  );
  const recovery = getRecoveryRecommendations(lastTraining, trainingLogs, acwr);

  // Sort by priority: high first, then medium, then low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const all = [...sleep, ...nutrition, ...recovery];
  all.sort(
    (a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
  );

  return all;
}
