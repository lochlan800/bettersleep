import RecoveryScoreCard from './RecoveryScoreCard'
import RecoveryScoreChart from './RecoveryScoreChart'
import TodayRecommendations from './TodayRecommendations'
import QuickLogWidgets from './QuickLogWidgets'
import { formatDate, getToday } from '../../utils/dateHelpers'

export default function DashboardPage() {
  const today = formatDate(getToday())

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-surface-500 dark:text-surface-400">{today}</p>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Recovery Dashboard</h2>
        <p className="text-xs text-surface-400 dark:text-surface-500">by Lochlan Ruddock</p>
      </div>
      <RecoveryScoreCard />
      <QuickLogWidgets />
      <TodayRecommendations />
      <RecoveryScoreChart />
    </div>
  )
}
