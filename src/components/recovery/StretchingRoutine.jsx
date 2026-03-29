import { useApp } from '../../context/AppContext'
import { calculateACWR } from '../../utils/scoring'
import stretches from '../../data/stretches'

export default function StretchingRoutine() {
  const { trainingLogs } = useApp()
  const lastRun = [...trainingLogs].sort((a, b) => b.date.localeCompare(a.date))[0]

  const relevantStretches = lastRun
    ? stretches.filter(s =>
        s.runTypes.length === 0 || s.runTypes.includes(lastRun.type)
      )
    : stretches

  return (
    <div className="space-y-3">
      {relevantStretches.map(s => (
        <div key={s.id} className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-surface-900 dark:text-surface-50">{s.name}</h4>
              <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">{s.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {s.targetMuscles.map(m => (
                  <span key={m} className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full">{m}</span>
                ))}
              </div>
            </div>
            <span className="text-sm font-medium text-surface-500 shrink-0">{s.durationSeconds}s</span>
          </div>
        </div>
      ))}
    </div>
  )
}
