import { useMemo, useState } from 'react'
import { Activity, ChevronDown, ChevronUp, Pencil } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import useRecoveryScore from '../../hooks/useRecoveryScore'
import { calculateSleepScore } from '../../utils/scoring'
import { getToday, getDaysAgo } from '../../utils/dateHelpers'
import Card from '../ui/Card'

function getAgeColor(age) {
  if (age <= 25) return '#10b981'
  if (age <= 35) return '#14b8a6'
  if (age <= 45) return '#eab308'
  if (age <= 55) return '#f97316'
  return '#ef4444'
}

function getMessage(age) {
  if (age <= 20) return 'Elite athlete level!'
  if (age <= 25) return 'Peak performance!'
  if (age <= 30) return 'In great shape!'
  if (age <= 35) return 'Looking good, keep it up!'
  if (age <= 40) return 'Solid foundation'
  if (age <= 45) return 'Room to improve'
  if (age <= 50) return 'Time to step it up'
  if (age <= 55) return 'Your body needs more care'
  return 'Let\'s get to work!'
}

const TIP_MAP = {
  Recovery: 'Log sleep, water, stretching & mindfulness',
  Sleep: 'Log 7-9 hours with a consistent bedtime',
  Training: 'Train 4-5 days per week consistently',
  Hydration: 'Tap +500ml each time you drink water',
  Stretching: 'Tick off stretches on the Recovery page',
  Mindfulness: 'Do one mindfulness activity today',
  Soreness: 'Rest up — log low soreness (1-2)',
}

export default function FitnessAgeCard() {
  const { sleepLogs, trainingLogs, settings, updateSettings } = useApp()
  const {
    recoveryScore, sleepScore, hydrationPercent,
    stretchingPercent, sorenessLevel, mindfulnessCount,
  } = useRecoveryScore()
  const [expanded, setExpanded] = useState(false)
  const [editingAge, setEditingAge] = useState(false)
  const [ageInput, setAgeInput] = useState('')

  const { fitnessAge, factors } = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => getDaysAgo(i))
    const sortedSleep = [...sleepLogs].sort((a, b) => b.date.localeCompare(a.date))
    const recentSleepScores = last7Days
      .map(date => {
        const log = sleepLogs.find(l => l.date === date)
        return log ? calculateSleepScore(log, sortedSleep.slice(0, 7)) : null
      })
      .filter(s => s !== null)
    const avgSleepScore = recentSleepScores.length > 0
      ? recentSleepScores.reduce((a, b) => a + b, 0) / recentSleepScores.length
      : 0

    const trainingDaysCount = last7Days.filter(date =>
      trainingLogs.some(l => l.date === date)
    ).length
    const trainingConsistency = Math.min(100, (trainingDaysCount / 5) * 100)
    const mindScore = Math.min(100, (mindfulnessCount / 3) * 100)
    const sorenessScore = ((5 - sorenessLevel) / 4) * 100

    const components = [
      { label: 'Recovery', score: recoveryScore, weight: 0.30 },
      { label: 'Sleep', score: avgSleepScore, weight: 0.20 },
      { label: 'Training', score: trainingConsistency, weight: 0.15 },
      { label: 'Hydration', score: Math.min(100, hydrationPercent), weight: 0.10 },
      { label: 'Stretching', score: stretchingPercent, weight: 0.10 },
      { label: 'Mindfulness', score: mindScore, weight: 0.10 },
      { label: 'Soreness', score: sorenessScore, weight: 0.05 },
    ]

    const fitnessScore = components.reduce((sum, c) => sum + c.score * c.weight, 0)
    const age = Math.round(65 - (fitnessScore / 100) * 47)

    const factorList = components.map(c => {
      const score = Math.round(c.score)
      const yearsAdded = Math.round(((100 - c.score) / 100) * c.weight * 47)
      const improvedScore = Math.min(100, c.score + 50)
      const yearsSaved = Math.round(((improvedScore - c.score) / 100) * c.weight * 47)
      return {
        label: c.label,
        score,
        weight: Math.round(c.weight * 100),
        yearsAdded,
        yearsSaved: yearsSaved > 0 ? yearsSaved : 0,
        tip: TIP_MAP[c.label],
      }
    }).sort((a, b) => a.score - b.score)

    return { fitnessAge: age, factors: factorList }
  }, [sleepLogs, trainingLogs, recoveryScore, sleepScore, hydrationPercent, stretchingPercent, sorenessLevel, mindfulnessCount])

  const color = getAgeColor(fitnessAge)
  const message = getMessage(fitnessAge)
  const agePercent = Math.max(0, Math.min(100, ((65 - fitnessAge) / 47) * 100))
  const ringSize = 130
  const strokeWidth = 10
  const radius = (ringSize - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (agePercent / 100) * circumference

  const weakFactors = factors.filter(f => f.score < 70)
  const strongFactors = factors.filter(f => f.score >= 70)

  return (
    <Card>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity size={20} style={{ color }} />
          <h3 className="font-bold text-surface-900 dark:text-surface-50">Fitness Age</h3>
        </div>

        {/* Tappable age ring */}
        <button onClick={() => setExpanded(!expanded)} className="relative flex flex-col items-center gap-1">
          <div className="relative flex items-center justify-center">
            <svg width={ringSize} height={ringSize} className="-rotate-90">
              <circle
                cx={ringSize / 2} cy={ringSize / 2} r={radius}
                fill="none" stroke="currentColor" strokeWidth={strokeWidth}
                className="text-surface-200 dark:text-surface-700"
              />
              <circle
                cx={ringSize / 2} cy={ringSize / 2} r={radius}
                fill="none" stroke={color} strokeWidth={strokeWidth}
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center" style={{ width: ringSize, height: ringSize }}>
              <span className="text-4xl font-bold text-surface-900 dark:text-surface-50">{fitnessAge}</span>
              <span className="text-xs text-surface-500 dark:text-surface-400">years</span>
            </div>
          </div>
          {!expanded && (
            <div className="flex items-center gap-1 text-xs text-primary-500">
              <span>Show Stats</span>
              <ChevronDown size={14} />
            </div>
          )}
        </button>

        <p className="text-sm text-center text-surface-600 dark:text-surface-300">
          Your body is performing like a <span className="font-bold" style={{ color }}>{fitnessAge}-year-old</span>
        </p>
        <p className="text-xs font-medium text-center" style={{ color }}>{message}</p>

        {/* Real age comparison */}
        {settings.realAge ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-surface-500 dark:text-surface-400">Real age: <span className="font-bold text-surface-800 dark:text-surface-100">{settings.realAge}</span></span>
            <span className="text-xs text-surface-400">|</span>
            <span className={`text-xs font-bold ${fitnessAge < settings.realAge ? 'text-emerald-500' : fitnessAge > settings.realAge ? 'text-red-500' : 'text-surface-500'}`}>
              {fitnessAge < settings.realAge
                ? `${settings.realAge - fitnessAge} yrs younger`
                : fitnessAge > settings.realAge
                  ? `${fitnessAge - settings.realAge} yrs older`
                  : 'Matches your real age'}
            </span>
            <button
              onClick={() => { setAgeInput(String(settings.realAge)); setEditingAge(true) }}
              className="p-1 rounded-md text-surface-400 hover:text-primary-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            ><Pencil size={12} /></button>
          </div>
        ) : !editingAge ? (
          <button
            onClick={() => setEditingAge(true)}
            className="text-xs text-primary-500 underline"
          >Set your real age</button>
        ) : null}

        {editingAge && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="5"
              max="100"
              value={ageInput}
              onChange={(e) => setAgeInput(e.target.value)}
              placeholder="Age"
              className="w-16 px-2 py-1 text-sm rounded-md border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50 text-center"
              autoFocus
            />
            <button
              onClick={() => {
                const val = parseInt(ageInput, 10)
                if (val >= 5 && val <= 100) {
                  updateSettings({ realAge: val })
                  setEditingAge(false)
                }
              }}
              className="px-2 py-1 text-xs font-medium rounded-md bg-primary-500 text-white"
            >Save</button>
            <button
              onClick={() => setEditingAge(false)}
              className="px-2 py-1 text-xs font-medium rounded-md bg-surface-200 dark:bg-surface-600 text-surface-600 dark:text-surface-300"
            >Cancel</button>
          </div>
        )}

        {/* Expanded detail view */}
        {expanded && (
          <div className="w-full space-y-4 mt-1">
            {/* What's adding years */}
            <div className="p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg">
              <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-3">What's making your age {fitnessAge}</p>
              <div className="space-y-2">
                {factors.map(f => (
                  <div key={f.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: f.score >= 70 ? '#10b981' : f.score >= 40 ? '#eab308' : '#ef4444' }}
                      />
                      <span className="text-xs text-surface-700 dark:text-surface-300">{f.label}</span>
                      <span className="text-[10px] text-surface-400">{f.score}%</span>
                    </div>
                    <span className={`text-xs font-bold ${f.yearsAdded === 0 ? 'text-emerald-500' : f.yearsAdded <= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                      {f.yearsAdded === 0 ? '0' : `+${f.yearsAdded}`} yrs
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to bring it down */}
            {weakFactors.length > 0 && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">How to bring it down</p>
                <div className="space-y-2.5">
                  {weakFactors.slice(0, 4).map(f => (
                    <div key={f.label}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-surface-800 dark:text-surface-200">{f.label}</span>
                        {f.yearsSaved > 0 && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">-{f.yearsSaved} yrs</span>
                        )}
                      </div>
                      <p className="text-[11px] text-surface-500 dark:text-surface-400">{f.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strong areas */}
            {strongFactors.length > 0 && (
              <div className="p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                  Keeping you young: {strongFactors.map(f => f.label).join(', ')}
                </p>
              </div>
            )}

            <button
              onClick={() => setExpanded(false)}
              className="w-full py-2 rounded-lg bg-surface-200 dark:bg-surface-700 text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors flex items-center justify-center gap-1"
            >
              <ChevronUp size={16} /> Hide Stats
            </button>
          </div>
        )}

        {/* Collapsed: simple factor bars */}
        {!expanded && (
          <>
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
              {factors.map(f => (
                <div key={f.label} className="flex items-center justify-between">
                  <span className="text-xs text-surface-600 dark:text-surface-400">{f.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${f.score}%`,
                          backgroundColor: f.score >= 70 ? '#10b981' : f.score >= 40 ? '#eab308' : '#ef4444',
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-surface-500 w-6 text-right">{f.score}</span>
                  </div>
                </div>
              ))}
            </div>

            {weakFactors.length > 0 ? (
              <div className="w-full mt-2 p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg">
                <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-2">To bring your age down:</p>
                <ul className="space-y-1.5">
                  {weakFactors.slice(0, 3).map(f => (
                    <li key={f.label} className="flex items-start gap-2">
                      <span className="text-red-500 text-xs mt-0.5">*</span>
                      <span className="text-xs text-surface-600 dark:text-surface-400">
                        <span className="font-medium text-surface-800 dark:text-surface-200">{f.label}:</span> {f.tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center mt-1">
                All areas looking strong — keep it up!
              </p>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
