import { useMemo } from 'react';
import { Lightbulb, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSleepRecommendations } from '../../utils/recommendations';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const PRIORITY_COLOR = {
  high: 'red',
  medium: 'yellow',
  low: 'green',
};

export default function SleepRecommendations() {
  const { sleepLogs, trainingLogs } = useApp();

  const recommendations = useMemo(
    () => getSleepRecommendations(sleepLogs, trainingLogs),
    [sleepLogs, trainingLogs],
  );

  return (
    <Card title="Sleep Tips" subtitle="Personalized recommendations">
      {recommendations.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-center gap-2">
          <CheckCircle size={32} className="text-emerald-500" />
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300">
            You're doing great!
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Your sleep habits look solid. Keep up the good work.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {recommendations.map((rec, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg bg-surface-50 dark:bg-surface-700/50 p-3"
            >
              <Lightbulb size={18} className="text-yellow-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge color={PRIORITY_COLOR[rec.priority] ?? 'gray'}>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-surface-700 dark:text-surface-300">
                  {rec.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
