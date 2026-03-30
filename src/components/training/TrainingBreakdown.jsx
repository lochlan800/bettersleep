import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useApp } from '../../context/AppContext'
import Card from '../ui/Card'

const TYPE_LABELS = {
  easy_long: 'Easy Long Run',
  short_intervals: 'Short Intervals',
  long_intervals: 'Long Intervals',
  park_run: 'Park Run',
  sprints: 'Sprints',
  strength: 'Strength',
  // legacy
  easy: 'Easy',
  tempo: 'Tempo',
  interval: 'Interval',
  long_run: 'Long Run',
  race: 'Race',
}

const COLORS = ['#14b8a6', '#818cf8', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#10b981', '#f97316', '#ec4899', '#6366f1']

export default function TrainingBreakdown() {
  const { trainingLogs } = useApp()

  const { timeData, sessionData } = useMemo(() => {
    const timeByType = {}
    const sessionsByType = {}

    trainingLogs.forEach((log) => {
      const type = log.type || 'unknown'
      timeByType[type] = (timeByType[type] || 0) + (log.durationMinutes || 0)
      sessionsByType[type] = (sessionsByType[type] || 0) + 1
    })

    const toChartData = (obj) =>
      Object.entries(obj)
        .map(([type, value]) => ({
          name: TYPE_LABELS[type] || type,
          value,
        }))
        .sort((a, b) => b.value - a.value)

    return { timeData: toChartData(timeByType), sessionData: toChartData(sessionsByType) }
  }, [trainingLogs])

  if (trainingLogs.length === 0) {
    return null
  }

  const totalMinutes = timeData.reduce((sum, d) => sum + d.value, 0)
  const totalSessions = sessionData.reduce((sum, d) => sum + d.value, 0)

  const renderLabel = ({ name, percent }) => {
    if (percent < 0.05) return null
    return `${(percent * 100).toFixed(0)}%`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Time Breakdown" subtitle={`${totalMinutes} minutes total`}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={timeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={renderLabel}
                labelLine={false}
              >
                {timeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value} min`}
                contentStyle={{
                  backgroundColor: 'var(--color-surface-800)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'var(--color-surface-50)',
                  fontSize: '12px',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Session Breakdown" subtitle={`${totalSessions} sessions total`}>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sessionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={renderLabel}
                labelLine={false}
              >
                {sessionData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value} sessions`}
                contentStyle={{
                  backgroundColor: 'var(--color-surface-800)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'var(--color-surface-50)',
                  fontSize: '12px',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
