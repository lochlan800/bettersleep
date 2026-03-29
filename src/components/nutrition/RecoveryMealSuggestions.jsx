import { useMemo } from 'react'
import { UtensilsCrossed, Flame, Wheat, Droplet } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { useApp } from '../../context/AppContext'
import { getToday } from '../../utils/dateHelpers'
import meals from '../../data/meals'

const INTENSITY_COLORS = {
  low: 'green',
  moderate: 'yellow',
  high: 'red',
}

const TIMING_LABELS = {
  immediate: 'Eat Immediately',
  within_2h: 'Within 2 Hours',
}

const TIMING_COLORS = {
  immediate: 'purple',
  within_2h: 'blue',
}

function getLastTrainingIntensity(trainingLogs) {
  if (!trainingLogs || trainingLogs.length === 0) return 'moderate'

  const sorted = [...trainingLogs].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const latest = sorted[0]
  const intensity = latest.intensity || 5

  if (intensity <= 3) return 'low'
  if (intensity <= 6) return 'moderate'
  return 'high'
}

export default function RecoveryMealSuggestions() {
  const { trainingLogs } = useApp()

  const intensity = useMemo(() => getLastTrainingIntensity(trainingLogs), [trainingLogs])

  const filteredMeals = useMemo(
    () => meals.filter((meal) => meal.intensity === intensity),
    [intensity],
  )

  return (
    <Card
      title="Recovery Meal Suggestions"
      subtitle={`Based on your last session intensity: ${intensity}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredMeals.map((meal) => (
          <div
            key={meal.id}
            className="rounded-xl border border-surface-200 dark:border-surface-600 bg-surface-50 dark:bg-surface-700/50 p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                  {meal.name}
                </h4>
              </div>
              <Badge color={TIMING_COLORS[meal.timing]}>
                {TIMING_LABELS[meal.timing]}
              </Badge>
            </div>

            <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
              {meal.description}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                <Flame className="h-3 w-3" />
                {meal.macros.protein}g protein
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                <Wheat className="h-3 w-3" />
                {meal.macros.carbs}g carbs
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                <Droplet className="h-3 w-3" />
                {meal.macros.fat}g fat
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredMeals.length === 0 && (
        <p className="text-sm text-surface-500 dark:text-surface-400 text-center py-6">
          No meal suggestions available for this intensity level.
        </p>
      )}
    </Card>
  )
}
