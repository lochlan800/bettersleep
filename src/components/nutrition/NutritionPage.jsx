import { Apple } from 'lucide-react'
import HydrationTracker from './HydrationTracker'
import RecoveryMealSuggestions from './RecoveryMealSuggestions'
import SupplementTimeline from './SupplementTimeline'

export default function NutritionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Apple className="h-7 w-7 text-primary-600 dark:text-primary-400" />
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
            Nutrition & Hydration
          </h2>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Fuel your recovery with proper hydration, meals, and supplements
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Hydration + Supplements */}
        <div className="space-y-6">
          <HydrationTracker />
          <SupplementTimeline />
        </div>

        {/* Right column: Meal Suggestions */}
        <div>
          <RecoveryMealSuggestions />
        </div>
      </div>
    </div>
  )
}
