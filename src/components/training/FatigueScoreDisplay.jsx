import { useMemo } from 'react'
import { Activity } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { useApp } from '../../context/AppContext'
import {
  calculateAcuteLoad,
  calculateChronicLoad,
  calculateACWR,
  calculateFatigueScore,
} from '../../utils/scoring'

function getZone(acwr) {
  if (acwr === 0) return { label: 'No data', color: 'gray', description: 'Log some training sessions to see your fatigue metrics.' }
  if (acwr < 0.8) return { label: 'Under-training', color: 'blue', description: 'Your recent load is low relative to your baseline. Consider gradually increasing volume.' }
  if (acwr <= 1.3) return { label: 'Safe zone', color: 'green', description: 'Your training load is well balanced. Keep it up!' }
  if (acwr <= 1.5) return { label: 'Caution', color: 'yellow', description: 'You are pushing harder than usual. Monitor how you feel and prioritize recovery.' }
  return { label: 'Danger', color: 'red', description: 'High injury risk. Consider reducing training load and focusing on recovery.' }
}

export default function FatigueScoreDisplay() {
  const { trainingLogs } = useApp()

  const metrics = useMemo(() => {
    const acuteLoad = calculateAcuteLoad(trainingLogs)
    const chronicLoad = calculateChronicLoad(trainingLogs)
    const acwr = calculateACWR(trainingLogs)
    const fatigueScore = calculateFatigueScore(acwr)
    const zone = getZone(acwr)

    return { acuteLoad, chronicLoad, acwr, fatigueScore, zone }
  }, [trainingLogs])

  const acwrBadgeColor = metrics.acwr === 0
    ? 'gray'
    : metrics.acwr <= 1.3
      ? 'green'
      : metrics.acwr <= 1.5
        ? 'yellow'
        : 'red'

  return (
    <Card title="Fatigue Metrics" subtitle="Acute:Chronic Workload Ratio">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-surface-500 dark:text-surface-400">Acute (7d)</p>
          <p className="mt-1 text-xl font-bold text-surface-900 dark:text-surface-50">
            {Math.round(metrics.acuteLoad)}
          </p>
          <p className="mt-1 text-[11px] text-surface-400 dark:text-surface-500 leading-tight">
            How hard you trained this week
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-500 dark:text-surface-400">Chronic (28d avg)</p>
          <p className="mt-1 text-xl font-bold text-surface-900 dark:text-surface-50">
            {Math.round(metrics.chronicLoad)}
          </p>
          <p className="mt-1 text-[11px] text-surface-400 dark:text-surface-500 leading-tight">
            How hard you normally train (your average)
          </p>
        </div>
        <div>
          <p className="text-xs text-surface-500 dark:text-surface-400">ACWR</p>
          <p className="mt-1 text-xl font-bold text-surface-900 dark:text-surface-50">
            {metrics.acwr.toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-surface-400 dark:text-surface-500 leading-tight">
            This week vs your average — close to 1.0 is ideal
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-surface-500 dark:text-surface-400" />
        <Badge color={acwrBadgeColor}>{metrics.zone.label}</Badge>
      </div>

      <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
        {metrics.zone.description}
      </p>
    </Card>
  )
}
