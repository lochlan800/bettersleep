import { useState, useMemo } from 'react'
import {
  Snowflake, Waves, Wind, Bath, Footprints, Timer, Armchair,
  Sparkles, Heart, Zap, Utensils, Droplets, Moon, Compass,
  ChevronDown, ChevronRight, AlertTriangle, Check,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useCelebration } from '../../context/CelebrationContext'
import { playSound } from '../../utils/playSound'
import { calculateACWR } from '../../utils/scoring'
import { getToday, getDaysAgo } from '../../utils/dateHelpers'
import useRecoveryScore from '../../hooks/useRecoveryScore'
import recoveryStrategies from '../../data/recoveryStrategies'
import { strategyAppropriate, strategyCaution, getSleepNeed, getAgeBandLabel } from '../../utils/ageGuidance'
import Card from '../ui/Card'

const ICONS = {
  Snowflake, Waves, Wind, Bath, Footprints, Timer, Armchair,
  Sparkles, Heart, Zap, Utensils, Droplets, Moon, Compass,
}

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'immediate', label: 'After a run' },
  { key: 'sameDay', label: 'Same day' },
  { key: 'restDay', label: 'Rest day' },
  { key: 'ongoing', label: 'Ongoing' },
]

export default function RecoveryStrategies() {
  const { trainingLogs, hydrationLogs, settings, toggleRecoveryAction, getTodayRecoveryActions } = useApp()
  const { triggerCelebration } = useCelebration()
  const age = settings.realAge
  const { recoveryScore, sorenessLevel, hydrationPercent, recoveryActionsCount } = useRecoveryScore()
  const doneToday = getTodayRecoveryActions().completed
  const [expanded, setExpanded] = useState({})
  const [category, setCategory] = useState('all')

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  // Work out today's state once, then let each strategy's `when` block decide
  // whether it applies. This is what makes the top section change day to day.
  const state = useMemo(() => {
    const today = getToday()
    const sorted = [...trainingLogs].sort((a, b) => b.date.localeCompare(a.date))
    const lastRun = sorted[0]
    const trainedToday = trainingLogs.some(l => l.date === today)

    let consecutive = 0
    for (let i = 0; i < 7; i++) {
      if (trainingLogs.some(l => l.date === getDaysAgo(i))) consecutive++
      else break
    }

    const acwr = calculateACWR(trainingLogs)
    const intensity = lastRun?.intensity ?? 0
    const duration = lastRun?.durationMinutes ?? 0

    return {
      afterTraining: trainedToday,
      minIntensity: intensity,
      hardSession: trainedToday && intensity >= 7,
      longRun: trainedToday && duration >= 60,
      highSoreness: sorenessLevel >= 3,
      veryHighSoreness: sorenessLevel >= 4,
      consecutiveTraining: consecutive,
      highACWR: acwr > 1.3,
      lowRecovery: recoveryScore < 60,
      lowHydration: hydrationPercent < 70,
    }
  }, [trainingLogs, hydrationLogs, sorenessLevel, recoveryScore, hydrationPercent])

  const matches = (when) => {
    if (!when || when.always) return false // "always" ones are staples, not alerts
    if (when.afterTraining && !state.afterTraining) return false
    if (when.minIntensity && state.minIntensity < when.minIntensity) return false
    if (when.hardSession && !state.hardSession) return false
    if (when.longRun && !state.longRun) return false
    if (when.highSoreness && !state.highSoreness) return false
    if (when.veryHighSoreness && !state.veryHighSoreness) return false
    if (when.consecutiveTraining && state.consecutiveTraining < when.consecutiveTraining) return false
    if (when.highACWR && !state.highACWR) return false
    if (when.lowRecovery && !state.lowRecovery) return false
    if (when.lowHydration && !state.lowHydration) return false
    return true
  }

  // Anything unsuitable for this age is dropped entirely rather than shown
  // with a warning — cold immersion has no place in a 12-year-old's list.
  const suitable = useMemo(
    () => recoveryStrategies.filter(s => strategyAppropriate(s, age)),
    [age],
  )

  const recommended = useMemo(
    () => suitable.filter(s => matches(s.when)).slice(0, 4),
    [suitable, state],
  )

  const visible = category === 'all'
    ? suitable
    : suitable.filter(s => s.category === category)

  const renderStrategy = (s, highlight = false) => {
    const Icon = ICONS[s.icon] || Sparkles
    const isOpen = expanded[s.id]
    const caution = strategyCaution(s, age)
    // The sleep entry quotes a figure that depends entirely on age, so it is
    // filled in here rather than hardcoded into the copy.
    const how = s.sleepTargetPlaceholder
      ? `Aim for ${getSleepNeed(age).label} a night${age ? '' : ' (set your age for a personalised target)'}. ${s.how}`
      : s.how
    const isDone = doneToday.includes(s.id)
    return (
      <div
        key={s.id}
        className={`border rounded-lg overflow-hidden ${
          isDone
            ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10'
            : highlight
              ? 'border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/10'
              : 'border-surface-200 dark:border-surface-700'
        }`}
      >
        <div className="flex items-center">
          <button
            onClick={() => {
              if (!isDone) { playSound('twinkle'); triggerCelebration() }
              toggleRecoveryAction(getToday(), s.id)
            }}
            className="flex items-center justify-center w-10 h-10 shrink-0 ml-1"
            title={isDone ? 'Mark as not done' : 'Mark as done'}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              isDone
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-surface-300 dark:border-surface-600'
            }`}>
              {isDone && <Check size={12} className="text-white" />}
            </div>
          </button>
          <button
            onClick={() => toggle(s.id)}
            className="flex-1 flex items-center gap-3 p-3 pl-1 text-left hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors min-w-0"
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${highlight ? 'bg-primary-500/15' : 'bg-accent-500/10'}`}>
              <Icon size={16} className={highlight ? 'text-primary-600 dark:text-primary-400' : 'text-accent-500'} />
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-sm font-medium ${isDone ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-surface-900 dark:text-surface-50'}`}>{s.name}</span>
              <p className="text-[11px] text-surface-500 dark:text-surface-400 mt-0.5">
                {s.timing}{s.duration !== '—' ? ` · ${s.duration}` : ''}
              </p>
            </div>
            {isOpen
              ? <ChevronDown size={16} className="text-primary-500 shrink-0" />
              : <ChevronRight size={16} className="text-surface-400 shrink-0" />}
          </button>
        </div>
        {isOpen && (
          <div className="px-3 pb-3 pl-11 space-y-2">
            <div>
              <p className="text-[11px] font-semibold text-surface-700 dark:text-surface-300 mb-0.5">How</p>
              <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">{how}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-surface-700 dark:text-surface-300 mb-0.5">Why it works</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{s.why}</p>
            </div>
            {caution && (
              <div className="flex items-start gap-2 px-2.5 py-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <AlertTriangle size={13} className="text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">{caution}</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recommended.length > 0 && (
        <Card title="Recommended Today" subtitle="Based on your training, soreness, and recovery score">
          <div className="space-y-2">
            {recommended.map(s => renderStrategy(s, true))}
          </div>
        </Card>
      )}

      <Card title="Recovery Strategies" subtitle={`${suitable.length} methods${age ? ` suited to ${getAgeBandLabel(age)}s` : ""}`}>
        <div className="flex items-center gap-3 mb-3 p-2.5 rounded-lg bg-surface-50 dark:bg-surface-700/50">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                Today's recovery actions
              </span>
              <span className={`text-xs font-bold ${recoveryActionsCount >= 3 ? 'text-emerald-500' : 'text-surface-500'}`}>
                {recoveryActionsCount}/3
              </span>
            </div>
            <div className="w-full h-1.5 bg-surface-200 dark:bg-surface-600 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (recoveryActionsCount / 3) * 100)}%`,
                  backgroundColor: recoveryActionsCount >= 3 ? '#10b981' : '#14b8a6',
                }}
              />
            </div>
            <p className="text-[10px] text-surface-400 mt-1">
              {recoveryActionsCount >= 3
                ? 'Full marks — this counts toward your recovery score.'
                : 'Tick off 3 to max out this part of your recovery score.'}
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                category === c.key
                  ? 'bg-primary-500 text-white'
                  : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
              }`}
            >{c.label}</button>
          ))}
        </div>
        <div className="space-y-2">
          {visible.map(s => renderStrategy(s))}
        </div>
      </Card>
    </div>
  )
}
