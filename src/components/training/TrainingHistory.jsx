import { useState, useMemo } from 'react'
import { Trash2, Pencil, Dumbbell } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import RunLogForm from './RunLogForm'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../utils/dateHelpers'

const TYPE_CONFIG = {
  easy: { label: 'Easy', color: 'green' },
  tempo: { label: 'Tempo', color: 'yellow' },
  interval: { label: 'Interval', color: 'red' },
  long_run: { label: 'Long Run', color: 'blue' },
  race: { label: 'Race', color: 'purple' },
}

export default function TrainingHistory() {
  const { trainingLogs, deleteTrainingLog, updateTrainingLog } = useApp()
  const [editingLog, setEditingLog] = useState(null)

  const recentLogs = useMemo(() => {
    return [...trainingLogs]
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
      .slice(0, 14)
  }, [trainingLogs])

  const handleSave = (updates) => {
    updateTrainingLog(editingLog.id, updates)
    setEditingLog(null)
  }

  return (
    <>
      <Card title="Training History" subtitle="Last 14 sessions">
        {recentLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Dumbbell className="mb-3 h-10 w-10 text-surface-300 dark:text-surface-600" />
            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
              No training logged yet
            </p>
            <p className="mt-1 text-xs text-surface-400 dark:text-surface-500">
              Log your first run to start tracking your progress!
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-surface-100 dark:divide-surface-700">
            {recentLogs.map((log) => {
              const config = TYPE_CONFIG[log.type] || { label: log.type, color: 'gray' }

              return (
                <li
                  key={log.id}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-surface-900 dark:text-surface-50">
                        {formatDate(log.date)}
                      </span>
                      <Badge color={config.color}>{config.label}</Badge>
                    </div>
                    <div className="mt-0.5 flex gap-3 text-xs text-surface-500 dark:text-surface-400">
                      <span>{log.distanceKm} km</span>
                      <span>{log.durationMinutes} min</span>
                      <span>RPE {log.intensity}</span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingLog(log)}
                      aria-label="Edit training log"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTrainingLog(log.id)}
                      aria-label="Delete training log"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      <Modal isOpen={!!editingLog} onClose={() => setEditingLog(null)} title="Edit Training Log">
        {editingLog && (
          <RunLogForm
            initialData={editingLog}
            editMode
            onSave={handleSave}
          />
        )}
      </Modal>
    </>
  )
}
