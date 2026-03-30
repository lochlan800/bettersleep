import { useState } from 'react'
import { ChevronDown, ChevronRight, Clock } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import stretches from '../../data/stretches'

const typeMap = {
  easy_long: 'long',
  short_intervals: 'interval',
  long_intervals: 'interval',
  park_run: 'tempo',
  sprints: 'interval',
  strength: 'hill',
  // legacy
  easy: 'easy',
  tempo: 'tempo',
  interval: 'interval',
  long_run: 'long',
  race: 'tempo',
}

export default function StretchingRoutine() {
  const { trainingLogs } = useApp()
  const [expanded, setExpanded] = useState({})
  const lastRun = [...trainingLogs].sort((a, b) => b.date.localeCompare(a.date))[0]

  const mappedType = lastRun ? typeMap[lastRun.type] || lastRun.type : null

  const relevantStretches = mappedType
    ? stretches.filter(s => s.runTypes.includes(mappedType))
    : stretches

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  if (relevantStretches.length === 0) {
    return <p className="text-sm text-surface-500 dark:text-surface-400 py-4 text-center">Log a run to get targeted stretches, or showing all stretches below.</p>
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-3">
        {lastRun
          ? `${relevantStretches.length} stretches for your ${lastRun.type.replace('_', ' ')} run`
          : `${relevantStretches.length} stretches — log a run for targeted recommendations`}
      </p>
      {relevantStretches.map(s => (
        <div
          key={s.id}
          className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggle(s.id)}
            className="w-full flex items-center justify-between gap-3 p-3 text-left hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {expanded[s.id] ? (
                <ChevronDown size={18} className="text-primary-500 shrink-0" />
              ) : (
                <ChevronRight size={18} className="text-surface-400 shrink-0" />
              )}
              <span className="font-medium text-surface-900 dark:text-surface-50 text-sm">{s.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-surface-400 shrink-0">
              <Clock size={14} />
              <span className="text-xs">{s.durationSeconds}s</span>
            </div>
          </button>
          {expanded[s.id] && (
            <div className="px-3 pb-3 pt-0 ml-9">
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">{s.description}</p>
              <div className="flex flex-wrap gap-1">
                {s.targetMuscles.map(m => (
                  <span key={m} className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded-full">{m}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
