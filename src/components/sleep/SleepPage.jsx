import SleepScoreDisplay from './SleepScoreDisplay';
import SleepLogForm from './SleepLogForm';
import SleepRecommendations from './SleepRecommendations';
import SleepHistoryChart from './SleepHistoryChart';
import SleepHistory from './SleepHistory';
import SleepTips from './SleepTips';

export default function SleepPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
        Sleep
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SleepScoreDisplay />
        <SleepLogForm />
      </div>

      <SleepRecommendations />
      <SleepHistoryChart />
      <SleepHistory />
      <SleepTips />
    </div>
  );
}
