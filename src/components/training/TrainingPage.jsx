import FatigueScoreDisplay from './FatigueScoreDisplay'
import RunLogForm from './RunLogForm'
import TrainingLoadChart from './TrainingLoadChart'
import TrainingBreakdown from './TrainingBreakdown'
import TrainingHistory from './TrainingHistory'

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Training</h2>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Track your runs and monitor training load
        </p>
      </div>

      <FatigueScoreDisplay />

      <div className="grid gap-6 lg:grid-cols-2">
        <RunLogForm />
        <TrainingLoadChart />
      </div>

      <TrainingBreakdown />

      <TrainingHistory />
    </div>
  )
}
