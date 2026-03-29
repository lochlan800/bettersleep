import { useMemo } from 'react'
import { Pill, Sun, Dumbbell, Moon, ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import supplements from '../../data/supplements'

const TIMING_CATEGORIES = [
  { key: 'morning', label: 'Morning', color: 'yellow', icon: Sun },
  { key: 'pre-workout', label: 'Pre-Workout', color: 'blue', icon: Dumbbell },
  { key: 'post-workout', label: 'Post-Workout', color: 'green', icon: ArrowRight },
  { key: 'evening', label: 'Evening', color: 'purple', icon: Moon },
]

function categorizeSupplement(timing) {
  const t = timing.toLowerCase()

  if (t.includes('morning') || t.includes('once') || t.includes('daily') || t.includes('twice daily')) {
    return 'morning'
  }
  if (t.includes('before') || t.includes('pre') || t.includes('during')) {
    return 'pre-workout'
  }
  if (t.includes('post') || t.includes('after') || t.includes('within')) {
    return 'post-workout'
  }
  if (t.includes('bed') || t.includes('evening') || t.includes('night')) {
    return 'evening'
  }

  return 'morning'
}

export default function SupplementTimeline() {
  const grouped = useMemo(() => {
    const groups = {}
    for (const cat of TIMING_CATEGORIES) {
      groups[cat.key] = []
    }

    for (const supp of supplements) {
      const category = categorizeSupplement(supp.timing)
      groups[category].push(supp)
    }

    return groups
  }, [])

  return (
    <Card title="Supplement Timeline" subtitle="Daily supplement schedule organized by timing">
      <div className="space-y-6">
        {TIMING_CATEGORIES.map((cat) => {
          const items = grouped[cat.key]
          if (items.length === 0) return null

          const Icon = cat.icon

          return (
            <div key={cat.key} className="relative">
              {/* Category header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-700">
                  <Icon className="h-4 w-4 text-surface-600 dark:text-surface-400" />
                </div>
                <Badge color={cat.color}>{cat.label}</Badge>
              </div>

              {/* Supplements in this category */}
              <div className="ml-4 border-l-2 border-surface-200 dark:border-surface-700 pl-6 space-y-3">
                {items.map((supp) => (
                  <div
                    key={supp.id}
                    className="relative rounded-lg bg-surface-50 dark:bg-surface-700/50 p-3"
                  >
                    {/* Connector dot */}
                    <div className="absolute -left-[31px] top-4 w-2.5 h-2.5 rounded-full bg-surface-300 dark:bg-surface-600 ring-2 ring-white dark:ring-surface-800" />

                    <div className="flex items-start gap-2 mb-1.5">
                      <Pill className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-50">
                          {supp.name}
                        </h4>
                        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">
                          {supp.dosage}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed ml-6">
                      {supp.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
