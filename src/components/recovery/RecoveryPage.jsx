import { useState } from 'react'
import { Moon, Droplets, Utensils, Target, Brain, Activity, Flame, ChevronDown, ChevronUp } from 'lucide-react'
import useRecoveryScore from '../../hooks/useRecoveryScore'
import ScoreRing from '../ui/ScoreRing'
import IceHeatRecommendation from './IceHeatRecommendation'
import RestDayPlanner from './RestDayPlanner'
import StretchingRoutine from './StretchingRoutine'
import FoamRollingProtocol from './FoamRollingProtocol'
import Card from '../ui/Card'

const getLabel = (s) => {
  if (s >= 80) return { text: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400' }
  if (s >= 60) return { text: 'Good', color: 'text-primary-600 dark:text-primary-400' }
  if (s >= 40) return { text: 'Fair', color: 'text-yellow-600 dark:text-yellow-400' }
  return { text: 'Poor', color: 'text-red-600 dark:text-red-400' }
}

const METRIC_CONFIG = [
  { key: 'sleep', label: 'Sleep', icon: Moon, tip: 'Log your sleep to boost this', color: '#6366f1' },
  { key: 'freshness', label: 'Freshness', icon: Activity, tip: 'Rest days between hard sessions help', color: '#14b8a6', needsACWR: true },
  { key: 'nutrition', label: 'Nutrition', icon: Utensils, tip: 'Log food on the Meals page', color: '#eab308' },
  { key: 'hydration', label: 'Hydration', icon: Droplets, tip: 'Tap +500ml on the water widget', color: '#3b82f6' },
  { key: 'soreness', label: 'Soreness', icon: Flame, tip: 'Log a low soreness level below', color: '#f97316' },
  { key: 'stretching', label: 'Stretching', icon: Activity, tip: 'Complete your stretching routine below', color: '#ec4899' },
  { key: 'mindful', label: 'Mindfulness', icon: Brain, tip: 'Try a mindfulness activity today', color: '#a855f7' },
  { key: 'goals', label: 'Goals', icon: Target, tip: 'Check in on your goals today', color: '#10b981' },
]

export default function RecoveryPage() {
  const {
    recoveryScore, sleepScore, fatigueScore, hydrationPercent,
    stretchingPercent, sorenessLevel, mindfulnessCount,
    nutritionPercent, goalCheckinPercent, hasReliableACWR,
  } = useRecoveryScore()
  const [showBreakdown, setShowBreakdown] = useState(false)
  const { text, color } = getLabel(recoveryScore)

  const metrics = METRIC_CONFIG
    .filter(m => !m.needsACWR || hasReliableACWR)
    .map(m => {
      let value = 0
      let weight = 0
      switch (m.key) {
        case 'sleep': value = Math.round(sleepScore); weight = 25; break
        case 'freshness': value = Math.round(100 - fatigueScore); weight = 15; break
        case 'nutrition': value = Math.round(nutritionPercent); weight = hasReliableACWR ? 15 : 20; break
        case 'hydration': value = Math.round(hydrationPercent); weight = 15; break
        case 'soreness': value = Math.round(((5 - sorenessLevel) / 4) * 100); weight = hasReliableACWR ? 10 : 15; break
        case 'stretching': value = Math.round(stretchingPercent); weight = hasReliableACWR ? 8 : 10; break
        case 'mindful': value = Math.min(100, Math.round((mindfulnessCount / 3) * 100)); weight = hasReliableACWR ? 7 : 8; break
        case 'goals': value = Math.round(goalCheckinPercent); weight = hasReliableACWR ? 5 : 7; break
      }
      return { ...m, value, weight }
    })

  const weakest = [...metrics]
    .filter(m => m.value < 60)
    .sort((a, b) => (a.value * a.weight) - (b.value * b.weight))
    .slice(0, 4)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Active Recovery</h2>

      {/* Recovery Score Overview */}
      <Card>
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full"
        >
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center shrink-0">
              <ScoreRing score={recoveryScore} size={110} strokeWidth={9} label="Recovery" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${color}`}>{text}</p>
                {showBreakdown
                  ? <ChevronUp size={18} className="text-surface-400" />
                  : <ChevronDown size={18} className="text-surface-400" />
                }
              </div>
              <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Today's recovery score</p>
              {!showBreakdown && weakest.length > 0 && recoveryScore < 80 && (
                <p className="text-xs text-surface-400 mt-2">
                  Focus areas: {weakest.map(m => m.label).join(', ')}
                </p>
              )}
            </div>
          </div>
        </button>

        {showBreakdown && (
          <div className="mt-5 space-y-2.5 pt-4 border-t border-surface-200 dark:border-surface-700">
            {metrics.map((m, i) => {
              const Icon = m.icon
              const barColor = m.value >= 70 ? m.color : m.value >= 40 ? '#f59e0b' : '#ef4444'
              return (
                <div
                  key={m.key}
                  className="ring-appear"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-2">
                      <Icon size={14} style={{ color: m.color }} />
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
        )}

        {/* Quick wins */}
        {weakest.length > 0 && recoveryScore < 80 && (
          <div className="space-y-2 pt-4 mt-4 border-t border-surface-200 dark:border-surface-700">
            <p className="text-xs font-semibold text-surface-600 dark:text-surface-400">Quick wins to boost your score:</p>
            {weakest.map(m => {
              const Icon = m.icon
              return (
                <div key={m.key} className="flex items-start gap-2.5">
                  <Icon size={14} className="mt-0.5 shrink-0" style={{ color: m.color }} />
                  <p className="text-xs text-surface-500 dark:text-surface-400">
                    <span className="font-medium text-surface-700 dark:text-surface-300">{m.label} ({m.value}%)</span> — {m.tip}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IceHeatRecommendation />
        <RestDayPlanner />
      </div>

      <Card title="Stretching Routine" subtitle="Targeted for your recent training">
        <StretchingRoutine />
      </Card>

      <Card title="Foam Rolling" subtitle="Release muscle tension">
        <FoamRollingProtocol />
      </Card>

      <style>{`
        .ring-appear {
          animation: ringPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes ringPop {
          0% { transform: translateX(-10px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
