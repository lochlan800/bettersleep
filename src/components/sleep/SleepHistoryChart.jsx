import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { calculateSleepScore } from '../../utils/scoring';
import { formatDate, getDaysAgo } from '../../utils/dateHelpers';
import Card from '../ui/Card';

function getBarColor(score) {
  if (score >= 80) return '#14b8a6';
  if (score >= 60) return '#eab308';
  return '#ef4444';
}

export default function SleepHistoryChart() {
  const { sleepLogs } = useApp();

  const chartData = useMemo(() => {
    // Build a map of date -> most recent log for that date
    const logsByDate = {};
    for (const log of sleepLogs) {
      logsByDate[log.date] = log;
    }

    // Generate last 14 days
    const data = [];
    for (let i = 13; i >= 0; i--) {
      const dateStr = getDaysAgo(i);
      const log = logsByDate[dateStr];
      let score = 0;
      if (log) {
        const recentLogs = sleepLogs.filter((l) => l.date <= dateStr).slice(-7);
        score = calculateSleepScore(log, recentLogs);
      }
      data.push({
        date: dateStr,
        label: formatDate(dateStr),
        score,
        hasData: !!log,
      });
    }
    return data;
  }, [sleepLogs]);

  const hasAnyData = chartData.some((d) => d.hasData);

  return (
    <Card title="Sleep History" subtitle="Last 14 days">
      {!hasAnyData ? (
        <p className="text-center text-sm text-surface-500 dark:text-surface-400 py-8">
          No sleep data in the last 14 days. Start logging to see your trends.
        </p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                className="text-surface-500"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11 }}
                className="text-surface-500"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg, #fff)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                formatter={(value) => [`${value}`, 'Score']}
                labelFormatter={(label) => label}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={32}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.hasData ? getBarColor(entry.score) : '#d1d5db'}
                    fillOpacity={entry.hasData ? 1 : 0.3}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
