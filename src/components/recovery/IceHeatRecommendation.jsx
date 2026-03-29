import { useApp } from '../../context/AppContext'
import Card from '../ui/Card'

const levels = [
  null, // index 0 unused
  { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'No specific ice/heat needed. Light movement and stretching is ideal for recovery.' },
  { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'Mild soreness. A warm shower or light heat pad can help relax tight muscles.' },
  { color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'Moderate soreness. Consider 15 min contrast therapy (2 min hot / 1 min cold × 3). An Epsom salt soak also helps.' },
  { color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'High soreness. Apply ice for 15-20 min on affected areas now. After 24hrs, switch to heat. Elevate if possible.' },
  { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', text: 'Severe soreness — full rest today. Ice 15-20 min every 2-3 hours. Epsom salt bath recommended. See a physio if pain persists.' },
]

export default function IceHeatRecommendation() {
  const { trainingLogs } = useApp()
  const lastRun = [...trainingLogs].sort((a, b) => b.date.localeCompare(a.date))[0]
  const soreness = lastRun?.sorenessLevel ?? 2
  const level = levels[soreness]

  return (
    <Card title="Ice / Heat Protocol">
      <div className="flex items-center gap-2 mb-3">
        {[1,2,3,4,5].map(n => (
          <div
            key={n}
            className={`flex-1 h-3 rounded-full transition-colors ${n <= soreness ? (soreness <= 2 ? 'bg-emerald-500' : soreness === 3 ? 'bg-yellow-500' : soreness === 4 ? 'bg-orange-500' : 'bg-red-500') : 'bg-surface-200 dark:bg-surface-700'}`}
          />
        ))}
      </div>
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">
        Soreness level: {soreness}/5 {lastRun ? `(from ${lastRun.date})` : '(default)'}
      </p>
      <div className={`rounded-lg p-3 ${level.bg}`}>
        <p className={`text-sm font-medium ${level.color}`}>{level.text}</p>
      </div>
    </Card>
  )
}
