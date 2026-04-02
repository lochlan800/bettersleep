import React, { createContext, useContext, useCallback, useEffect, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { calculateTrainingLoad } from '../utils/scoring';
import { getToday } from '../utils/dateHelpers';

// ── Context ─────────────────────────────────────────────────────────

const AppContext = createContext(null);

// ── Default values ──────────────────────────────────────────────────

const DEFAULT_SETTINGS = {
  darkMode: false,
  units: 'metric',
  weeklyTargetKm: 50,
  bodyWeightKg: 70,
};

// ── Provider ────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const [sleepLogs, setSleepLogs] = useLocalStorage('bs_sleep_logs', []);
  const [trainingLogs, setTrainingLogs] = useLocalStorage('bs_training_logs', []);
  const [hydrationLogs, setHydrationLogs] = useLocalStorage('bs_hydration_logs', []);
  const [mindfulnessLogs, setMindfulnessLogs] = useLocalStorage('bs_mindfulness_logs', []);
  const [mealPlans, setMealPlans] = useLocalStorage('bs_meal_plans', []);
  const [mealCompletions, setMealCompletions] = useLocalStorage('bs_meal_completions', []);
  const [competitionLogs, setCompetitionLogs] = useLocalStorage('bs_competition_logs', []);
  const [stretchingLogs, setStretchingLogs] = useLocalStorage('bs_stretching_logs', []);
  const [settings, setSettings] = useLocalStorage('bs_settings', DEFAULT_SETTINGS);

  // ── Dark mode side-effect ───────────────────────────────────────

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // ── Sleep actions ───────────────────────────────────────────────

  const addSleepLog = useCallback(
    (log) => {
      const entry = {
        ...log,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setSleepLogs((prev) => [...prev, entry]);
    },
    [setSleepLogs],
  );

  const updateSleepLog = useCallback(
    (id, updates) => {
      setSleepLogs((prev) =>
        prev.map((log) => (log.id === id ? { ...log, ...updates } : log)),
      );
    },
    [setSleepLogs],
  );

  const deleteSleepLog = useCallback(
    (id) => {
      setSleepLogs((prev) => prev.filter((log) => log.id !== id));
    },
    [setSleepLogs],
  );

  // ── Training actions ────────────────────────────────────────────

  const addTrainingLog = useCallback(
    (log) => {
      const trainingLoad = calculateTrainingLoad(log.durationMinutes, log.intensity);
      const entry = {
        ...log,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        trainingLoad,
      };
      setTrainingLogs((prev) => [...prev, entry]);
    },
    [setTrainingLogs],
  );

  const updateTrainingLog = useCallback(
    (id, updates) => {
      setTrainingLogs((prev) =>
        prev.map((log) => {
          if (log.id !== id) return log;
          const merged = { ...log, ...updates };
          merged.trainingLoad = calculateTrainingLoad(merged.durationMinutes, merged.intensity);
          return merged;
        }),
      );
    },
    [setTrainingLogs],
  );

  const deleteTrainingLog = useCallback(
    (id) => {
      setTrainingLogs((prev) => prev.filter((log) => log.id !== id));
    },
    [setTrainingLogs],
  );

  // ── Hydration actions ───────────────────────────────────────────

  const addHydrationEntry = useCallback(
    (date, entry) => {
      setHydrationLogs((prev) => {
        const dateStr = typeof date === 'string' ? date : date.toISOString().slice(0, 10);
        const existing = prev.find((d) => d.date === dateStr);

        if (existing) {
          return prev.map((d) =>
            d.date === dateStr
              ? { ...d, entries: [...d.entries, { ...entry, id: crypto.randomUUID() }] }
              : d,
          );
        }

        return [
          ...prev,
          {
            date: dateStr,
            entries: [{ ...entry, id: crypto.randomUUID() }],
          },
        ];
      });
    },
    [setHydrationLogs],
  );

  const getTodayHydration = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    return (
      hydrationLogs.find((d) => d.date === today) ?? {
        date: today,
        entries: [],
      }
    );
  }, [hydrationLogs]);

  const resetTodayHydration = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    setHydrationLogs((prev) => prev.filter((d) => d.date !== today));
  }, [setHydrationLogs]);

  // ── Mindfulness actions ──────────────────────────────────────────

  const toggleMindfulnessActivity = useCallback(
    (date, activityId) => {
      const dateStr = typeof date === 'string' ? date : date.toISOString().slice(0, 10);
      setMindfulnessLogs((prev) => {
        const existing = prev.find((d) => d.date === dateStr);
        if (existing) {
          const activities = existing.activities.includes(activityId)
            ? existing.activities.filter((id) => id !== activityId)
            : [...existing.activities, activityId];
          return prev.map((d) => (d.date === dateStr ? { ...d, activities } : d));
        }
        return [...prev, { date: dateStr, activities: [activityId] }];
      });
    },
    [setMindfulnessLogs],
  );

  const getTodayMindfulness = useCallback(() => {
    const today = getToday();
    return (
      mindfulnessLogs.find((d) => d.date === today) ?? {
        date: today,
        activities: [],
      }
    );
  }, [mindfulnessLogs]);

  // ── Meal Plan actions ────────────────────────────────────────────

  const updateMealPlan = useCallback(
    (plan) => {
      setMealPlans(plan);
    },
    [setMealPlans],
  );

  // ── Meal completion actions ───────────────────────────────────────

  const toggleMealCompletion = useCallback(
    (date, mealKey) => {
      const dateStr = typeof date === 'string' ? date : date.toISOString().slice(0, 10);
      setMealCompletions((prev) => {
        const existing = prev.find((d) => d.date === dateStr);
        if (existing) {
          const completed = existing.completed.includes(mealKey)
            ? existing.completed.filter((k) => k !== mealKey)
            : [...existing.completed, mealKey];
          return prev.map((d) => (d.date === dateStr ? { ...d, completed } : d));
        }
        return [...prev, { date: dateStr, completed: [mealKey] }];
      });
    },
    [setMealCompletions],
  );

  const getTodayMealCompletions = useCallback(() => {
    const today = getToday();
    return (
      mealCompletions.find((d) => d.date === today) ?? {
        date: today,
        completed: [],
      }
    );
  }, [mealCompletions]);

  // ── Stretching actions ────────────────────────────────────────────

  const toggleStretch = useCallback(
    (date, stretchId) => {
      const dateStr = typeof date === 'string' ? date : date.toISOString().slice(0, 10);
      setStretchingLogs((prev) => {
        const existing = prev.find((d) => d.date === dateStr);
        if (existing) {
          const completed = existing.completed.includes(stretchId)
            ? existing.completed.filter((id) => id !== stretchId)
            : [...existing.completed, stretchId];
          return prev.map((d) => (d.date === dateStr ? { ...d, completed } : d));
        }
        return [...prev, { date: dateStr, completed: [stretchId] }];
      });
    },
    [setStretchingLogs],
  );

  const getTodayStretching = useCallback(() => {
    const today = getToday();
    return (
      stretchingLogs.find((d) => d.date === today) ?? {
        date: today,
        completed: [],
      }
    );
  }, [stretchingLogs]);

  // ── Competition actions ───────────────────────────────────────────

  const addCompetitionLog = useCallback(
    (log) => {
      const entry = {
        ...log,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setCompetitionLogs((prev) => [...prev, entry]);
    },
    [setCompetitionLogs],
  );

  const updateCompetitionLog = useCallback(
    (id, updates) => {
      setCompetitionLogs((prev) =>
        prev.map((log) => (log.id === id ? { ...log, ...updates } : log)),
      );
    },
    [setCompetitionLogs],
  );

  const deleteCompetitionLog = useCallback(
    (id) => {
      setCompetitionLogs((prev) => prev.filter((log) => log.id !== id));
    },
    [setCompetitionLogs],
  );

  // ── Settings ────────────────────────────────────────────────────

  const updateSettings = useCallback(
    (partial) => {
      setSettings((prev) => ({ ...prev, ...partial }));
    },
    [setSettings],
  );

  // ── Context value (memoised to avoid unnecessary re-renders) ───

  const value = useMemo(
    () => ({
      // State
      sleepLogs,
      trainingLogs,
      hydrationLogs,
      mindfulnessLogs,
      mealPlans,
      mealCompletions,
      competitionLogs,
      stretchingLogs,
      settings,

      // Actions
      addSleepLog,
      updateSleepLog,
      deleteSleepLog,
      addTrainingLog,
      updateTrainingLog,
      deleteTrainingLog,
      addHydrationEntry,
      getTodayHydration,
      resetTodayHydration,
      toggleMindfulnessActivity,
      getTodayMindfulness,
      updateMealPlan,
      toggleMealCompletion,
      getTodayMealCompletions,
      toggleStretch,
      getTodayStretching,
      addCompetitionLog,
      updateCompetitionLog,
      deleteCompetitionLog,
      updateSettings,
    }),
    [
      sleepLogs,
      trainingLogs,
      hydrationLogs,
      mindfulnessLogs,
      mealPlans,
      mealCompletions,
      competitionLogs,
      stretchingLogs,
      settings,
      addSleepLog,
      updateSleepLog,
      deleteSleepLog,
      addTrainingLog,
      updateTrainingLog,
      deleteTrainingLog,
      addHydrationEntry,
      getTodayHydration,
      resetTodayHydration,
      toggleMindfulnessActivity,
      getTodayMindfulness,
      updateMealPlan,
      toggleMealCompletion,
      getTodayMealCompletions,
      toggleStretch,
      getTodayStretching,
      addCompetitionLog,
      updateCompetitionLog,
      deleteCompetitionLog,
      updateSettings,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ── Consumer hook ───────────────────────────────────────────────────

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an <AppProvider>');
  }
  return context;
}
