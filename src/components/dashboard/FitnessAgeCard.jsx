import { useMemo } from 'react'
import { Activity } from 'lucide-react'
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

export default function FitnessAgeCard() {
  const { sleepLogs, trainingLogs } = useApp()
  const {
    recoveryScore, sleepScore, hydrationPercent,
    stretchingPercent, sorenessLevel, mindfulnessCount,
  } = useRecoveryScore()

  const { fitnessAge, factors } = useMemo(() => {
    const today = getToday()

    // Sleep consistency — average sleep score over last 7 days
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

    // Training consistency — how many of last 7 days had training
    const trainingDaysCount = last7Days.filter(date =>
      trainingLogs.some(l => l.date === date)
    ).length
    const trainingConsistency = Math.min(100, (trainingDaysCount / 5) * 100)

    // Mindfulness score (0-100)
    const mindScore = Math.min(100, (mindfulnessCount / 3) * 100)

    // Soreness score (inverted: level 1 = 100%, level 5 = 0%)
    const sorenessScore = ((5 - sorenessLevel) / 4) * 100

    // Weighted fitness score
    const weights = {
      recovery: 0.30,
      sleep: 0.20,
      training: 0.15,
      hydration: 0.10,
      stretching: 0.10,
      mindfulness: 0.10,
      soreness: 0.05,
    }

    const components = {
      recovery: { score: recoveryScore, weight: weights.recovery, label: 'Recovery' },
      sleep: { score: avgSleepScore, weight: weights.sleep, label: 'Sleep' },
      training: { score: trainingConsistency, weight: weights.training, label: 'Training' },
      hydration: { score: Math.min(100, hydrationPercent), weight: weights.hydration, label: 'Hydration' },
      stretching: { score: stretchingPercent, weight: weights.stretching, label: 'Stretching' },
      mindfulness: { score: mindScore, weight: weights.mindfulness, label: 'Mindfulness' },
      soreness: { score: sorenessScore, weight: weights.soreness, label: 'Soreness' },
    }

    const fitnessScore = Object.values(components).reduce(
      (sum, c) => sum + c.score * c.weight, 0
    )

    // Map 0-100 score to age 65-18
    const age = Math.round(65 - (fitnessScore / 100) * 47)

    // Build factors list sorted by impact
    const factorList = Object.values(components)
      .map(c => ({
        label: c.label,
        score: Math.round(c.score),
        helping: c.score >= 60,
      }))
      .sort((a, b) => b.score - a.score)

    return { fitnessAge: age, factors: factorList }
  }, [sleepLogs, trainingLogs, recoveryScore, sleepScore, hydrationPercent, stretchingPercent, sorenessLevel, mindfulnessCount])

  const color = getAgeColor(fitnessAge)
  const message = getMessage(fitnessAge)

  // SVG ring showing age mapped to 0-100 scale (18=100, 65=0)
  const agePercent = Math.max(0, Math.min(100, ((65 - fitnessAge) / 47) * 100))
  const ringSize = 130
  const strokeWidth = 10
  const radius = (ringSize - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (agePercent / 100) * circumference

  return (
    <Card>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity size={20} style={{ color }} />
          <h3 className="font-bold text-surface-900 dark:text-surface-50">Fitness Age</h3>
        </div>

        {/* Age ring */}
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

        <p className="text-sm text-center text-surface-600 dark:text-surface-300">
          Your body is performing like a <span className="font-bold" style={{ color }}>{fitnessAge}-year-old</span>
        </p>
        <p className="text-xs font-medium text-center" style={{ color }}>{message}</p>

        {/* Factor breakdown */}
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
      </div>
    </Card>
  )
}
