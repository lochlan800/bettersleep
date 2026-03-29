import React, { createContext, useContext, useCallback, useEffect, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { calculateTrainingLoad } from '../utils/scoring';

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
      settings,

      // Actions
      addSleepLog,
      deleteSleepLog,
      addTrainingLog,
      deleteTrainingLog,
      addHydrationEntry,
      getTodayHydration,
      resetTodayHydration,
      updateSettings,
    }),
    [
      sleepLogs,
      trainingLogs,
      hydrationLogs,
      settings,
      addSleepLog,
      deleteSleepLog,
      addTrainingLog,
      deleteTrainingLog,
      addHydrationEntry,
      getTodayHydration,
      resetTodayHydration,
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
