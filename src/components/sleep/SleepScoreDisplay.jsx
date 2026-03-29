import { useMemo } from 'react';
import { Moon, Sunrise, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSleepDurationHours, calculateSleepScore } from '../../utils/scoring';
import { formatTime } from '../../utils/dateHelpers';
import Card from '../ui/Card';
import ScoreRing from '../ui/ScoreRing';

export default function SleepScoreDisplay() {
  const { sleepLogs } = useApp();

  const latest = useMemo(() => {
    if (sleepLogs.length === 0) return null;
    const sorted = [...sleepLogs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    return sorted[0];
  }, [sleepLogs]);

  const score = useMemo(() => {
    if (!latest) return 0;
    const recentLogs = sleepLogs.slice(-7);
    return calculateSleepScore(latest, recentLogs);
  }, [latest, sleepLogs]);

  const duration = useMemo(() => {
    if (!latest) return 0;
    return getSleepDurationHours(latest.bedtime, latest.wakeTime);
  }, [latest]);

  if (!latest) {
    return (
      <Card className="flex flex-col items-center justify-center py-10 text-center">
        <Moon size={40} className="text-surface-300 dark:text-surface-600 mb-3" />
        <p className="text-surface-500 dark:text-surface-400 text-sm">
          No sleep data yet. Log your first night to see your score.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Sleep Score" subtitle="Most recent entry">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <ScoreRing score={score} label="Sleep" />
        </div>

        <div className="grid grid-cols-3 gap-4 w-full text-center">
          <div className="flex flex-col items-center gap-1">
            <Moon size={18} className="text-primary-500" />
            <span className="text-xs text-surface-500 dark:text-surface-400">Bedtime</span>
            <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">
              {formatTime(latest.bedtime)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Sunrise size={18} className="text-primary-500" />
            <span className="text-xs text-surface-500 dark:text-surface-400">Wake</span>
            <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">
              {formatTime(latest.wakeTime)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Clock size={18} className="text-primary-500" />
            <span className="text-xs text-surface-500 dark:text-surface-400">Duration</span>
            <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">
              {duration.toFixed(1)}h
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
