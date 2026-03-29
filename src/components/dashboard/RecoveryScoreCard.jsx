import useRecoveryScore from '../../hooks/useRecoveryScore'
import ScoreRing from '../ui/ScoreRing'
import Card from '../ui/Card'

const getLabel = (s) => {
  if (s >= 80) return { text: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400' }
  if (s >= 60) return { text: 'Good', color: 'text-primary-600 dark:text-primary-400' }
  if (s >= 40) return { text: 'Fair', color: 'text-yellow-600 dark:text-yellow-400' }
  return { text: 'Poor', color: 'text-red-600 dark:text-red-400' }
}

export default function RecoveryScoreCard() {
  const { recoveryScore, sleepScore, fatigueScore, hydrationPercent } = useRecoveryScore()
  const { text, color } = getLabel(recoveryScore)

  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative flex items-center justify-center">
          <ScoreRing score={recoveryScore} size={140} strokeWidth={10} label="Recovery" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className={`text-3xl font-bold ${color}`}>{text}</p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1 mb-4">Today's recovery readiness</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Sleep', value: Math.round(sleepScore), unit: '/100' },
              { label: 'Fatigue', value: Math.round(100 - fatigueScore), unit: '/100' },
              { label: 'Hydration', value: Math.round(hydrationPercent), unit: '%' },
            ].map(({ label, value, unit }) => (
              <div key={label} className="bg-surface-50 dark:bg-surface-700/50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-surface-900 dark:text-surface-50">{value}<span className="text-xs font-normal text-surface-400">{unit}</span></p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
