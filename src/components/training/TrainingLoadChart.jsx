import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { subDays, format, parseISO } from 'date-fns'
import Card from '../ui/Card'
import { useApp } from '../../context/AppContext'
import { calculateTrainingLoad } from '../../utils/scoring'

export default function TrainingLoadChart() {
  const { trainingLogs } = useApp()

  const chartData = useMemo(() => {
    const today = new Date()
    const days = []

    for (let i = 27; i >= 0; i--) {
      const date = subDays(today, i)
      const dateStr = format(date, 'yyyy-MM-dd')
      const label = format(date, 'MMM d')

      const dayLogs = trainingLogs.filter((log) => log.date === dateStr)
      const load = dayLogs.reduce(
        (sum, log) => sum + calculateTrainingLoad(log.durationMinutes, log.intensity),
        0,
      )

      days.push({ date: label, load })
    }

    return days
  }, [trainingLogs])

  return (
    <Card title="Training Load" subtitle="Daily load over the last 28 days">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              className="text-surface-500"
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11 }} className="text-surface-500" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-800, #1e293b)',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#f8fafc',
                fontSize: '0.875rem',
              }}
              formatter={(value) => [value, 'Training Load']}
            />
            <Area
              type="monotone"
              dataKey="load"
              stroke="#7c3aed"
              strokeWidth={2}
              fill="url(#loadGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
