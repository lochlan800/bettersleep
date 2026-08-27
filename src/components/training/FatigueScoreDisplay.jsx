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
  getTrainingSpanDays,
  MIN_ACWR_SPAN_DAYS,
} from '../../utils/scoring'

function getZone(acwr, acuteLoad) {
  // Zero is ambiguous on its own: it can mean no history, or a genuine week
  // off. By the time this runs the history check has already passed, so a
  // zero here means you simply did not train this week.
  if (acwr === 0) {
    return acuteLoad === 0
      ? { label: 'Rest week', color: 'blue', description: 'You have not trained in the last 7 days. A full rest week is when adaptation happens — just avoid stringing too many together.' }
      : { label: 'No data', color: 'gray', description: 'Log some training sessions to see your fatigue metrics.' }
  }
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
    const zone = getZone(acwr, acuteLoad)
    // ACWR needs a baseline to compare this week against. Until there is
    // enough history it is not just imprecise, it is undefined.
    const spanDays = getTrainingSpanDays(trainingLogs)
    const daysNeeded = Math.max(0, MIN_ACWR_SPAN_DAYS - spanDays)
    const ready = trainingLogs.length > 0 && daysNeeded === 0

    return { acuteLoad, chronicLoad, acwr, fatigueScore, zone, spanDays, daysNeeded, ready }
  }, [trainingLogs])

  const acwrBadgeColor = metrics.acwr === 0
    ? (metrics.acuteLoad === 0 ? 'blue' : 'gray')
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
            {metrics.ready ? metrics.acwr.toFixed(2) : '—'}
          </p>
          <p className="mt-1 text-[11px] text-surface-400 dark:text-surface-500 leading-tight">
            {metrics.ready
              ? 'This week vs your average — close to 1.0 is ideal'
              : 'Needs more training history'}
          </p>
        </div>
      </div>

      {metrics.ready ? (
        <>
          <div className="mt-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-surface-500 dark:text-surface-400" />
            <Badge color={acwrBadgeColor}>{metrics.zone.label}</Badge>
          </div>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            {metrics.zone.description}
          </p>
        </>
      ) : (
        <div className="mt-4 p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600">
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300">
            {trainingLogs.length === 0
              ? 'Log some training sessions to see this.'
              : `Not enough training history yet — about ${metrics.daysNeeded} more day${metrics.daysNeeded === 1 ? '' : 's'} of logging.`}
          </p>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            This ratio compares your last 7 days against your longer-term average. Until there are at least {MIN_ACWR_SPAN_DAYS} days between your first and last session, both halves are worked out from the same runs, so the answer would always come out as exactly 1.00 no matter what you did.
          </p>
        </div>
      )}

      {/* What the numbers mean */}
      <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
        <p className="text-xs font-semibold text-surface-600 dark:text-surface-400 mb-2">What do the numbers mean?</p>
        <div className="space-y-1.5 text-[12px] text-surface-500 dark:text-surface-400">
          <div className="flex items-start gap-2">
            <span className="inline-block w-2 h-2 mt-1 rounded-full bg-blue-400 shrink-0" />
            <span><strong>Below 0.8</strong> — You're training less than usual. Your body is resting but your fitness might drop if this goes on too long.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="inline-block w-2 h-2 mt-1 rounded-full bg-green-500 shrink-0" />
            <span><strong>0.8 – 1.3</strong> — The sweet spot! You're training about the right amount compared to what your body is used to.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="inline-block w-2 h-2 mt-1 rounded-full bg-yellow-500 shrink-0" />
            <span><strong>1.3 – 1.5</strong> — You're pushing harder than normal. Be careful and make sure you're recovering properly.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="inline-block w-2 h-2 mt-1 rounded-full bg-red-500 shrink-0" />
            <span><strong>Above 1.5</strong> �� You're doing way more than your body is used to. High risk of injury — take it easy!</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
