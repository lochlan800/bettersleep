import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  calculateSleepScore,
  calculateAcuteLoad,
  calculateChronicLoad,
  calculateACWR,
  calculateFatigueScore,
  calculateHydrationTarget,
  calculateRecoveryScore,
} from '../utils/scoring';
import stretches from '../data/stretches';

/**
 * Computes the current recovery dashboard metrics from app state.
 *
 * @returns {{
 *   recoveryScore:    number,
 *   sleepScore:       number,
 *   fatigueScore:     number,
 *   acuteLoad:        number,
 *   chronicLoad:      number,
 *   acwr:             number,
 *   hydrationPercent: number,
 * }}
 */
export default function useRecoveryScore() {
  const { sleepLogs, trainingLogs, hydrationLogs, mindfulnessLogs, stretchingLogs, mealCompletions, settings } = useApp();

  return useMemo(() => {
    // Sleep – score the most recent log using the last 7 as context for consistency
    const sortedSleep = [...sleepLogs].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    const recentSleep = sortedSleep.slice(0, 7);
    const latestSleep = recentSleep[0];
    const sleepScore = latestSleep
      ? calculateSleepScore(latestSleep, recentSleep)
      : 0;

    // Training load metrics
    const acuteLoad = calculateAcuteLoad(trainingLogs);
    const chronicLoad = calculateChronicLoad(trainingLogs);
    const acwr = calculateACWR(trainingLogs);
    const fatigueScore = calculateFatigueScore(acwr);

    // Hydration – today only
    const today = new Date().toISOString().slice(0, 10);
    const todayHydration = hydrationLogs.find((d) => d.date === today);
    const totalMl = todayHydration
      ? todayHydration.entries.reduce((sum, e) => sum + (e.amountMl ?? 0), 0)
      : 0;

    // Calculate today's training minutes for hydration target
    const todayTrainingMinutes = trainingLogs
      .filter((log) => log.date === today)
      .reduce((sum, log) => sum + (log.durationMinutes ?? 0), 0);

    const hydrationTarget = calculateHydrationTarget(
      settings.bodyWeightKg,
      todayTrainingMinutes,
    );
    const hydrationPercent =
      hydrationTarget > 0
        ? Math.min(100, Math.round((totalMl / hydrationTarget) * 100))
        : 0;

    // Soreness — comes from training logs, not sleep logs
    const sortedTraining = [...trainingLogs].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    const latestSoreness = sortedTraining[0]?.sorenessLevel ?? 1;

    // ACWR is only reliable with enough training history (>= 14 days, non-zero chronic)
    const hasReliableACWR = chronicLoad > 0 && trainingLogs.length >= 4;

    // Only use fatigue score when ACWR is reliable — otherwise it spikes
    // misleadingly (e.g. first week of logging gives ACWR of 7+)
    const displayFatigueScore = hasReliableACWR ? fatigueScore : 0;

    // Mindfulness — today's completed activities
    const todayMindfulness = mindfulnessLogs.find((d) => d.date === today);
    const mindfulnessCount = todayMindfulness ? todayMindfulness.activities.length : 0;

    // Stretching — percentage of relevant stretches completed today
    const todayStretching = stretchingLogs.find((d) => d.date === today);
    const stretchingDone = todayStretching ? todayStretching.completed.length : 0;
    const totalStretches = stretches.length;
    const stretchingPercent = totalStretches > 0
      ? Math.round((stretchingDone / totalStretches) * 100)
      : 0;

    // Meals — how many planned meals eaten today
    const todayMealLog = mealCompletions.find((d) => d.date === today);
    const mealsEatenCount = todayMealLog ? todayMealLog.completed.length : 0;

    const recoveryScore = calculateRecoveryScore({
      sleepScore,
      fatigueScore,
      hydrationPercent,
      sorenessLevel: latestSoreness,
      hasReliableACWR,
      mindfulnessCount,
      stretchingPercent,
      mealsEatenCount,
    });

    return {
      recoveryScore,
      sleepScore,
      fatigueScore: displayFatigueScore,
      acuteLoad,
      chronicLoad,
      acwr: Math.round(acwr * 100) / 100,
      hydrationPercent,
      stretchingPercent,
    };
  }, [sleepLogs, trainingLogs, hydrationLogs, mindfulnessLogs, stretchingLogs, mealCompletions, settings.bodyWeightKg]);
}
