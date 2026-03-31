import { parseISO, differenceInCalendarDays, differenceInHours } from 'date-fns';
import { getSleepDurationHours, calculateACWR } from './scoring';

const HYDRATION_TARGET = 2000;

/**
 * Get sleep-related recommendations.
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

  const sorted = [...sleepLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentSleep = sorted.slice(0, 7);
  const avgDuration =
    recentSleep.reduce(
      (sum, log) => sum + getSleepDurationHours(log.bedtime, log.wakeTime),
      0
    ) / recentSleep.length;

  const latestDuration = getSleepDurationHours(recentSleep[0].bedtime, recentSleep[0].wakeTime);

  if (latestDuration > 9) {
    recommendations.push({
      category: 'sleep',
      priority: 'medium',
      text: `You slept ${latestDuration.toFixed(1)} hours last night. Oversleeping can leave you feeling groggy — aim for 7-9 hours for optimal recovery.`,
    });
  } else if (latestDuration < 6) {
    recommendations.push({
      category: 'sleep',
      priority: 'high',
      text: `You only got ${latestDuration.toFixed(1)} hours of sleep last night. Try to get to bed earlier tonight — your body needs 7-9 hours to recover properly.`,
    });
  } else if (avgDuration < 7) {
    recommendations.push({
      category: 'sleep',
      priority: 'high',
      text: `Your average sleep is ${avgDuration.toFixed(1)} hours over the last ${recentSleep.length} nights. Aim for 7-9 hours per night to optimize recovery.`,
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
        text: 'Your bedtime varies by over 45 minutes. Try to go to bed within a 30-minute window each night to improve sleep quality.',
      });
    }
  }

  // Heavy training yesterday
  const today = new Date();
  const yesterdayLogs = trainingLogs.filter((log) => {
    const daysAgo = differenceInCalendarDays(today, parseISO(log.date));
    return daysAgo === 1;
  });

  if (yesterdayLogs.some((log) => log.intensity >= 7)) {
    recommendations.push({
      category: 'sleep',
      priority: 'high',
      text: 'You had a high-intensity session yesterday. Try to get an extra 30 minutes of sleep tonight to support muscle repair.',
    });
  }

  // Quality
  const avgQuality =
    recentSleep.reduce((sum, log) => sum + log.qualityRating, 0) /
    recentSleep.length;

  if (avgQuality < 3) {
    recommendations.push({
      category: 'sleep',
      priority: 'medium',
      text: 'Your sleep quality has been low recently. Limit screen time 1 hour before bed, keep your room cool, and avoid caffeine after 2 PM.',
    });
  } else if (avgQuality >= 4 && recentSleep.length >= 3) {
    recommendations.push({
      category: 'sleep',
      priority: 'low',
      text: 'Your sleep quality has been good — keep up your current routine!',
    });
  }

  return recommendations;
}

/**
 * Get nutrition/hydration recommendations.
 */
export function getNutritionRecommendations(lastTraining, todayHydrationMl) {
  const recommendations = [];

  const hydrationPercent = (todayHydrationMl / HYDRATION_TARGET) * 100;

  if (hydrationPercent === 0) {
    recommendations.push({
      category: 'nutrition',
      priority: 'high',
      text: "You haven't logged any water today. Start hydrating — aim for 2,000ml throughout the day.",
    });
  } else if (hydrationPercent < 50) {
    recommendations.push({
      category: 'nutrition',
      priority: 'high',
      text: `You've only had ${todayHydrationMl}ml of water (${Math.round(hydrationPercent)}%). Drink ${HYDRATION_TARGET - todayHydrationMl}ml more to hit your 2,000ml target.`,
    });
  } else if (hydrationPercent < 80) {
    recommendations.push({
      category: 'nutrition',
      priority: 'medium',
      text: `You're at ${Math.round(hydrationPercent)}% of your water target. Keep sipping — ${HYDRATION_TARGET - todayHydrationMl}ml to go.`,
    });
  } else if (hydrationPercent >= 100) {
    recommendations.push({
      category: 'nutrition',
      priority: 'low',
      text: 'Great job hitting your water target today! Stay topped up if you have training later.',
    });
  }

  if (!lastTraining) {
    recommendations.push({
      category: 'nutrition',
      priority: 'low',
      text: 'Rest day — focus on whole foods rich in antioxidants and anti-inflammatory nutrients to support recovery.',
    });
    return recommendations;
  }

  // Post-training meal guidance based on intensity
  const hoursSinceTraining = differenceInHours(new Date(), parseISO(lastTraining.date));

  if (hoursSinceTraining <= 2 && hoursSinceTraining >= 0) {
    if (lastTraining.intensity >= 7) {
      recommendations.push({
        category: 'nutrition',
        priority: 'high',
        text: "You're in the protein synthesis window after a hard session. Have 30-40g protein and 60-80g carbs now — try chicken with rice and veg.",
      });
    } else if (lastTraining.intensity >= 4) {
      recommendations.push({
        category: 'nutrition',
        priority: 'medium',
        text: "Good time for a recovery meal — 20-30g protein and 40-60g carbs. A salmon bowl with quinoa and greens works well.",
      });
    }
  } else if (lastTraining.intensity >= 7) {
    recommendations.push({
      category: 'nutrition',
      priority: 'medium',
      text: 'After your high-intensity session, make sure your next meal includes quality protein and carbs to support recovery.',
    });
  }

  return recommendations;
}

const TYPE_LABELS = {
  easy_long: 'easy long run',
  short_intervals: 'short intervals',
  long_intervals: 'long intervals',
  park_run: 'park run',
  sprints: 'sprints',
  strength: 'strength session',
  cycling: 'cycling session',
};

const TYPE_RECOVERY_TIPS = {
  easy_long: 'After your long run, focus on hip flexor, IT band, and glute recovery. Consider foam rolling and gentle stretching.',
  short_intervals: 'Short intervals tax your calves and achilles. Do targeted stretching and consider compression socks for recovery.',
  long_intervals: 'Long intervals are demanding — prioritize hamstring and quad recovery with foam rolling and stretching.',
  park_run: 'After your park run, a mix of calf stretches and hamstring work will help you recover well.',
  sprints: 'Sprint sessions heavily load your hamstrings and hip flexors. Spend extra time stretching these areas.',
  strength: 'After strength training, focus on the muscle groups you worked. Light stretching and adequate protein will speed recovery.',
  cycling: 'After cycling, stretch your quads, hip flexors, and lower back to counter the flexed riding position.',
};

/**
 * Get recovery-related recommendations.
 */
export function getRecoveryRecommendations(lastTraining, trainingLogs, acwr, mindfulnessCount, stretchingCount) {
  const recommendations = [];

  // ACWR warnings
  if (acwr > 1.5) {
    recommendations.push({
      category: 'recovery',
      priority: 'high',
      text: `Your ACWR is ${acwr.toFixed(2)} — danger zone (>1.5). Take a rest day or do very light activity to reduce injury risk.`,
    });
  } else if (acwr > 1.3) {
    recommendations.push({
      category: 'recovery',
      priority: 'medium',
      text: `Your ACWR is ${acwr.toFixed(2)} — approaching the danger zone. Consider reducing intensity over the next few days.`,
    });
  } else if (acwr > 0 && acwr < 0.8) {
    recommendations.push({
      category: 'recovery',
      priority: 'low',
      text: `Your ACWR is ${acwr.toFixed(2)} — you're under-training relative to your baseline. You can safely increase load this week.`,
    });
  }

  // Consecutive training days
  if (trainingLogs.length > 0) {
    const today = new Date();
    const sortedLogs = [...trainingLogs]
      .filter((log) => differenceInCalendarDays(today, parseISO(log.date)) >= 0)
      .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

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
        text: `You've trained ${consecutiveDays} days in a row. Schedule a rest day to let your body recover and adapt.`,
      });
    } else if (consecutiveDays === 3) {
      recommendations.push({
        category: 'recovery',
        priority: 'medium',
        text: "You've trained 3 days in a row. Consider an easy day or rest day tomorrow.",
      });
    }
  }

  // Soreness
  if (lastTraining && lastTraining.sorenessLevel) {
    const soreness = lastTraining.sorenessLevel;
    if (soreness >= 4) {
      recommendations.push({
        category: 'recovery',
        priority: 'high',
        text: 'High soreness detected. Use ice for 15 minutes on sore areas, rest, and avoid intense training until it drops.',
      });
    } else if (soreness === 3) {
      recommendations.push({
        category: 'recovery',
        priority: 'medium',
        text: 'Moderate soreness — spend 15-20 minutes foam rolling followed by light stretching to speed up recovery.',
      });
    }
  }

  // Training type specific tips
  if (lastTraining && lastTraining.type) {
    const tip = TYPE_RECOVERY_TIPS[lastTraining.type];
    if (tip) {
      recommendations.push({
        category: 'recovery',
        priority: 'low',
        text: tip,
      });
    }
  }

  // Mindfulness nudge
  if (mindfulnessCount === 0) {
    recommendations.push({
      category: 'recovery',
      priority: 'medium',
      text: "You haven't done any mindfulness today. Even 5 minutes of breathing or journaling helps your mind recover too.",
    });
  } else if (mindfulnessCount >= 3) {
    recommendations.push({
      category: 'recovery',
      priority: 'low',
      text: `Great work — you've completed ${mindfulnessCount} mindfulness activities today. Your mental recovery is on track.`,
    });
  }

  // Stretching nudge
  if (stretchingCount === 0 && lastTraining) {
    recommendations.push({
      category: 'recovery',
      priority: 'medium',
      text: "You haven't done any stretches today. Head to Recovery and tick off some stretches to boost your recovery score.",
    });
  } else if (stretchingCount > 0 && stretchingCount < 5 && lastTraining) {
    recommendations.push({
      category: 'recovery',
      priority: 'low',
      text: `You've done ${stretchingCount} stretches today. Try to complete a few more for best results.`,
    });
  }

  return recommendations;
}

/**
 * Get all recommendations combined and sorted by priority.
 */
export function getAllRecommendations({
  sleepLogs,
  trainingLogs,
  todayHydrationMl,
  mindfulnessCount,
  stretchingCount,
}) {
  const today = new Date();
  const sortedTraining = [...trainingLogs].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );
  const lastTraining = sortedTraining.length > 0 ? sortedTraining[0] : null;
  const acwr = calculateACWR(trainingLogs);

  const sleep = getSleepRecommendations(sleepLogs, trainingLogs);
  const nutrition = getNutritionRecommendations(lastTraining, todayHydrationMl);
  const recovery = getRecoveryRecommendations(lastTraining, trainingLogs, acwr, mindfulnessCount, stretchingCount);

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const all = [...sleep, ...nutrition, ...recovery];
  all.sort(
    (a, b) => (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
  );

  return all;
}
