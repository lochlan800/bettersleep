import { useEffect, useRef } from 'react'
import useRecoveryScore from '../../hooks/useRecoveryScore'
import ScoreRing from '../ui/ScoreRing'
import Card from '../ui/Card'
import { useCelebration } from '../../context/CelebrationContext'

const getLabel = (s) => {
  if (s >= 80) return { text: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400' }
  if (s >= 60) return { text: 'Good', color: 'text-primary-600 dark:text-primary-400' }
  if (s >= 40) return { text: 'Fair', color: 'text-yellow-600 dark:text-yellow-400' }
  return { text: 'Poor', color: 'text-red-600 dark:text-red-400' }
}

function nutritionScore(count) {
  if (count >= 3) return 100
  if (count === 2) return 70
  if (count === 1) return 40
  return 0
}

export default function RecoveryScoreCard() {
  const {
    recoveryScore, sleepScore, fatigueScore, hydrationPercent,
    stretchingPercent, sorenessLevel, mindfulnessCount,
    mealsEatenCount, goalCheckinPercent, hasReliableACWR,
  } = useRecoveryScore()
  const { triggerConfetti, splashJustFinished, clearSplashDone } = useCelebration()
  const { text, color } = getLabel(recoveryScore)
  const confettiFired = useRef(false)
  const shouldAnimate = splashJustFinished

  useEffect(() => {
    if (splashJustFinished) clearSplashDone()
  }, [splashJustFinished, clearSplashDone])

  useEffect(() => {
    if (recoveryScore >= 80 && !confettiFired.current) {
      confettiFired.current = true
      triggerConfetti()
    }
  }, [recoveryScore, triggerConfetti])

  const metrics = [
    { label: 'Sleep', value: Math.round(sleepScore), color: '#6366f1' },
    ...(hasReliableACWR ? [{ label: 'Freshness', value: Math.round(100 - fatigueScore), color: '#14b8a6' }] : []),
    { label: 'Soreness', value: Math.round(((5 - sorenessLevel) / 4) * 100), color: '#f97316' },
    { label: 'Hydration', value: Math.round(hydrationPercent), color: '#3b82f6' },
    { label: 'Mindful', value: Math.min(100, Math.round((mindfulnessCount / 3) * 100)), color: '#a855f7' },
    { label: 'Stretching', value: Math.round(stretchingPercent), color: '#ec4899' },
    { label: 'Nutrition', value: nutritionScore(mealsEatenCount), color: '#eab308' },
    { label: 'Goals', value: Math.round(goalCheckinPercent), color: '#10b981' },
  ]

  return (
    <Card>
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
          <div className="relative flex items-center justify-center">
            <ScoreRing score={recoveryScore} size={140} strokeWidth={10} label="Recovery" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className={`text-3xl font-bold ${color}`}>{text}</p>
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Today's recovery readiness</p>
          </div>
        </div>

        {/* Animated metric rings */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`flex flex-col items-center gap-1 ${shouldAnimate ? 'ring-appear' : ''}`}
              style={shouldAnimate ? { animationDelay: `${i * 150}ms` } : undefined}
            >
              <ScoreRing score={m.value} size={52} strokeWidth={4} label="" color={m.color} />
              <span className="text-[10px] font-medium text-surface-600 dark:text-surface-400 text-center leading-tight">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ring-appear {
          animation: ringPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes ringPop {
          0% {
            transform: scale(0) translateY(20px);
            opacity: 0;
          }
          60% {
            transform: scale(1.15) translateY(-4px);
            opacity: 1;
          }
          80% {
            transform: scale(0.95) translateY(2px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </Card>
  )
}
