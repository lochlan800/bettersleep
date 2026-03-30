import { Droplets } from 'lucide-react'
import HydrationTracker from './HydrationTracker'

export default function NutritionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Droplets className="h-7 w-7 text-blue-500" />
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
            Water
          </h2>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Track your daily water intake
          </p>
        </div>
      </div>

      <HydrationTracker />
    </div>
  )
}
