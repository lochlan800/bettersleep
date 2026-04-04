import { useState } from 'react'
import { ChevronDown, ChevronRight, Clock, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getToday } from '../../utils/dateHelpers'
import { vibrate } from '../../utils/vibrate'
import stretches from '../../data/stretches'

const typeMap = {
  easy_long: 'long',
  short_intervals: 'interval',
  long_intervals: 'interval',
  park_run: 'tempo',
  sprints: 'interval',
  strength: 'hill',
  cycling: 'easy',
  other: 'easy',
  // legacy
  easy: 'easy',
  tempo: 'tempo',
  interval: 'interval',
  long_run: 'long',
  race: 'tempo',
}

export default function StretchingRoutine() {
  const { trainingLogs, toggleStretch, getTodayStretching } = useApp()
  const [expanded, setExpanded] = useState({})
  const todayStretching = getTodayStretching()
  const lastRun = [...trainingLogs].sort((a, b) => b.date.localeCompare(a.date))[0]

  const mappedType = lastRun ? typeMap[lastRun.type] || lastRun.type : null

  const relevantStretches = mappedType
    ? stretches.filter(s => s.runTypes.includes(mappedType))
    : stretches

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  if (relevantStretches.length === 0) {
    return <p className="text-sm text-surface-500 dark:text-surface-400 py-4 text-center">Log a run to get targeted stretches, or showing all stretches below.</p>
  }

  const completedCount = todayStretching.completed.filter(id => relevantStretches.some(s => s.id === id)).length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-surface-500 dark:text-surface-400">
          {lastRun
            ? `${relevantStretches.length} stretches for your ${lastRun.type.replace('_', ' ')} run`
            : `${relevantStretches.length} stretches — log a run for targeted recommendations`}
        </p>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          completedCount === 0
            ? 'bg-surface-200 dark:bg-surface-700 text-surface-500'
            : completedCount >= relevantStretches.length
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
        }`}>
          {completedCount}/{relevantStretches.length} done
        </span>
      </div>
      {relevantStretches.map(s => {
        const isDone = todayStretching.completed.includes(s.id)
        return (
        <div
          key={s.id}
          className={`border rounded-lg overflow-hidden ${isDone ? 'border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10' : 'border-surface-200 dark:border-surface-700'}`}
        >
          <div className="flex items-center">
            <button
              onClick={() => { vibrate('tap'); toggleStretch(getToday(), s.id) }}
              className={`flex items-center justify-center w-10 h-10 shrink-0 ml-1 transition-colors ${
                isDone ? 'text-green-500' : 'text-surface-300 dark:text-surface-600 hover:text-primary-500'
              }`}
              title={isDone ? 'Mark as not done' : 'Mark as done'}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                isDone ? 'bg-green-500 border-green-500' : 'border-surface-300 dark:border-surface-600'
              }`}>
                {isDone && <Check size={12} className="text-white" />}
              </div>
            </button>
            <button
              onClick={() => toggle(s.id)}
              className="flex-1 flex items-center justify-between gap-3 p-3 text-left hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {expanded[s.id] ? (
                  <ChevronDown size={18} className="text-primary-500 shrink-0" />
                ) : (
                  <ChevronRight size={18} className="text-surface-400 shrink-0" />
                )}
                <span className={`font-medium text-sm ${isDone ? 'text-green-700 dark:text-green-400 line-through' : 'text-surface-900 dark:text-surface-50'}`}>{s.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-surface-400 shrink-0">
                <Clock size={14} />
                <span className="text-xs">{s.durationSeconds}s</span>
              </div>
            </button>
          </div>
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
        )
      })}
    </div>
  )
}
