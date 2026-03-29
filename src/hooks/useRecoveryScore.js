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
  const { sleepLogs, trainingLogs, hydrationLogs, settings } = useApp();

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

    // Overall recovery – use default soreness of 1 (no soreness) when not tracked
    const latestSoreness = latestSleep?.sorenessLevel ?? 1;
    const recoveryScore = calculateRecoveryScore({
      sleepScore,
      fatigueScore,
      hydrationPercent,
      sorenessLevel: latestSoreness,
    });

    return {
      recoveryScore,
      sleepScore,
      fatigueScore,
      acuteLoad,
      chronicLoad,
      acwr: Math.round(acwr * 100) / 100,
      hydrationPercent,
    };
  }, [sleepLogs, trainingLogs, hydrationLogs, settings.bodyWeightKg]);
}
