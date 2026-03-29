import { useApp } from '../../context/AppContext'
import { calculateACWR } from '../../utils/scoring'
import { getDaysAgo, formatDate } from '../../utils/dateHelpers'
import Card from '../ui/Card'

export default function RestDayPlanner() {
  const { trainingLogs } = useApp()
  const acwr = calculateACWR(trainingLogs)

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = getDaysAgo(6 - i)
    const hasTraining = trainingLogs.some(l => l.date === date)
    return { date, hasTraining }
  })

  const consecutive = [...days].reverse().findIndex(d => !d.hasTraining)
  const consecutiveCount = consecutive === -1 ? 7 : consecutive

  const needsRest = consecutiveCount >= 3 || acwr > 1.5

  return (
    <Card title="Rest Day Planner">
      <div className="flex gap-1.5 mb-4">
        {days.map(({ date, hasTraining }) => (
          <div key={date} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full h-8 rounded-md flex items-center justify-center text-xs font-bold ${
              hasTraining
                ? 'bg-primary-500 text-white'
                : 'bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400'
            }`}>
              {hasTraining ? 'R' : '—'}
            </div>
            <span className="text-[10px] text-surface-400">{formatDate(date).split(' ')[0]}</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-surface-500 dark:text-surface-400 mb-3">
        <span className="inline-block w-3 h-3 rounded bg-primary-500 mr-1 align-middle" /> Run &nbsp;
        <span className="inline-block w-3 h-3 rounded bg-surface-200 dark:bg-surface-700 mr-1 align-middle" /> Rest
      </div>
      {needsRest ? (
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
          <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
            {consecutiveCount >= 3
              ? `${consecutiveCount} consecutive training days. Schedule a rest day soon.`
              : `ACWR is ${acwr.toFixed(2)} — high training load. Consider a rest or easy day.`}
          </p>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Training load looks balanced. Keep it up!
          </p>
        </div>
      )}
    </Card>
  )
}
