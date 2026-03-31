import { Moon, Utensils, Heart, Timer, Info } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getAllRecommendations } from '../../utils/recommendations'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

const icons = { sleep: Moon, nutrition: Utensils, recovery: Heart, training: Timer }
const priorityColor = { high: 'red', medium: 'yellow', low: 'blue' }

export default function TodayRecommendations() {
  const { sleepLogs, trainingLogs, getTodayHydration, getTodayMindfulness, getTodayStretching } = useApp()

  const todayHydration = getTodayHydration()
  const todayHydrationMl = todayHydration.entries.reduce((sum, e) => sum + (e.amountMl ?? 0), 0)

  const todayMindfulness = getTodayMindfulness()
  const mindfulnessCount = todayMindfulness.activities.length

  const todayStretching = getTodayStretching()
  const stretchingCount = todayStretching.completed.length

  const recs = getAllRecommendations({
    sleepLogs,
    trainingLogs,
    todayHydrationMl,
    mindfulnessCount,
    stretchingCount,
  }).slice(0, 5)

  if (recs.length === 0) {
    return (
      <Card title="Today's Recommendations">
        <div className="flex items-center gap-3 text-surface-500 dark:text-surface-400 py-4">
          <Info size={20} />
          <p className="text-sm">Log some data to get personalized recovery recommendations.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Today's Recommendations">
      <div className="space-y-3">
        {recs.map((rec, i) => {
          const Icon = icons[rec.category] ?? Info
          return (
            <div key={i} className="flex items-start gap-3 p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg">
              <Icon size={18} className="text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-surface-800 dark:text-surface-200">{rec.text}</p>
              </div>
              <Badge color={priorityColor[rec.priority] ?? 'gray'} className="shrink-0 capitalize">{rec.priority}</Badge>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
