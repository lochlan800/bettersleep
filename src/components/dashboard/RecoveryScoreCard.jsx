import { useEffect, useRef, useMemo } from 'react'
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

const TIPS = {
  Sleep: 'Log your sleep to improve this',
  Freshness: 'Rest days between hard sessions help',
  Soreness: 'Tap a soreness level on the widget below',
  Hydration: 'Tap +500ml on the water widget',
  Mindful: 'Try a mindfulness activity today',
  Stretching: 'Complete your stretching routine',
  Nutrition: 'Log food on the Meals page',
  Goals: 'Check in on your goals today',
}

export default function RecoveryScoreCard() {
  const {
    recoveryScore, sleepScore, fatigueScore, hydrationPercent,
    stretchingPercent, sorenessLevel, mindfulnessCount,
    nutritionPercent, goalCheckinPercent, hasReliableACWR,
  } = useRecoveryScore()
  const { triggerConfetti } = useCelebration()
  const { text, color } = getLabel(recoveryScore)
  const confettiFired = useRef(false)

  useEffect(() => {
    if (recoveryScore >= 80 && !confettiFired.current) {
      confettiFired.current = true
      triggerConfetti()
    }
  }, [recoveryScore, triggerConfetti])

  const metrics = [
    { label: 'Sleep', value: Math.round(sleepScore), color: '#6366f1', weight: 25 },
    ...(hasReliableACWR ? [{ label: 'Freshness', value: Math.round(100 - fatigueScore), color: '#14b8a6', weight: 15 }] : []),
    { label: 'Nutrition', value: Math.round(nutritionPercent), color: '#eab308', weight: hasReliableACWR ? 15 : 20 },
    { label: 'Hydration', value: Math.round(hydrationPercent), color: '#3b82f6', weight: 15 },
    { label: 'Soreness', value: Math.round(((5 - sorenessLevel) / 4) * 100), color: '#f97316', weight: hasReliableACWR ? 10 : 15 },
    { label: 'Stretching', value: Math.round(stretchingPercent), color: '#ec4899', weight: hasReliableACWR ? 8 : 10 },
    { label: 'Mindful', value: Math.min(100, Math.round((mindfulnessCount / 3) * 100)), color: '#a855f7', weight: hasReliableACWR ? 7 : 8 },
    { label: 'Goals', value: Math.round(goalCheckinPercent), color: '#10b981', weight: hasReliableACWR ? 5 : 7 },
  ]

  const weakest = useMemo(() => {
    return [...metrics]
      .filter(m => m.value < 60)
      .sort((a, b) => (a.value * a.weight) - (b.value * b.weight))
      .slice(0, 3)
  }, [metrics])

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-6 w-full">
          <div className="relative flex items-center justify-center shrink-0">
            <ScoreRing score={recoveryScore} size={130} strokeWidth={10} label="Recovery" />
          </div>
          <div className="flex-1">
            <p className={`text-3xl font-bold ${color}`}>{text}</p>
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Today's recovery</p>
            {recoveryScore < 80 && weakest.length > 0 && (
              <p className="text-xs text-surface-400 mt-2">
                Biggest gaps: {weakest.map(m => m.label).join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {metrics.map((m, i) => {
            const barColor = m.value >= 70 ? m.color : m.value >= 40 ? '#f59e0b' : '#ef4444'
            return (
              <div
                key={m.label}
                className="ring-appear"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{m.label}</span>
                    <span className="text-[10px] text-surface-400">{m.weight}%</span>
                  </div>
                  <span className={`text-xs font-bold ${m.value >= 70 ? 'text-emerald-500' : m.value >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {m.value}
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(100, m.value)}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {weakest.length > 0 && recoveryScore < 80 && (
          <div className="space-y-1.5 pt-2 border-t border-surface-200 dark:border-surface-700">
            <p className="text-[11px] font-semibold text-surface-600 dark:text-surface-400">Quick wins to boost your score:</p>
            {weakest.map(m => (
              <div key={m.label} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: m.color }} />
                <p className="text-[11px] text-surface-500 dark:text-surface-400">
                  <span className="font-medium text-surface-700 dark:text-surface-300">{m.label}</span> — {TIPS[m.label]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .ring-appear {
          animation: ringPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes ringPop {
          0% {
            transform: translateX(-10px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </Card>
  )
}
