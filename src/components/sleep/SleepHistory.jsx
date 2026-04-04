import { useState, useMemo } from 'react'
import { Pencil, Trash2, Star, Moon } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getSleepDurationHours } from '../../utils/scoring'
import { getToday } from '../../utils/dateHelpers'
import { vibrate } from '../../utils/vibrate'
import { playSound } from '../../utils/playSound'
import Card from '../ui/Card'

export default function SleepHistory() {
  const { sleepLogs, updateSleepLog, deleteSleepLog } = useApp()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)

  const recentLogs = useMemo(() => {
    return [...sleepLogs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 14)
  }, [sleepLogs])

  const handleEdit = (log) => {
    setEditingId(log.id)
    setEditForm({
      date: log.date,
      bedtime: log.bedtime,
      wakeTime: log.wakeTime,
      qualityRating: log.qualityRating,
      notes: log.notes || '',
    })
  }

  const handleSave = () => {
    updateSleepLog(editingId, {
      date: editForm.date,
      bedtime: editForm.bedtime,
      wakeTime: editForm.wakeTime,
      qualityRating: editForm.qualityRating,
      notes: editForm.notes.trim() || undefined,
    })
    setEditingId(null)
    setEditForm(null)
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm(null)
  }

  if (recentLogs.length === 0) return null

  return (
    <Card title="Sleep History" subtitle="Last 14 entries">
      <div className="space-y-2">
        {recentLogs.map(log => {
          const duration = getSleepDurationHours(log.bedtime, log.wakeTime)
          const isEditing = editingId === log.id

          if (isEditing) {
            return (
              <div key={log.id} className="p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                      max={getToday()}
                      className="w-full px-2 py-1.5 rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">Quality</label>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, qualityRating: n })}
                        >
                          <Star
                            size={20}
                            className={n <= editForm.qualityRating ? 'fill-yellow-400 text-yellow-400' : 'text-surface-300 dark:text-surface-600'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">Bedtime</label>
                    <input
                      type="time"
                      value={editForm.bedtime}
                      onChange={e => setEditForm({ ...editForm, bedtime: e.target.value })}
                      className="w-full px-2 py-1.5 rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">Wake time</label>
                    <input
                      type="time"
                      value={editForm.wakeTime}
                      onChange={e => setEditForm({ ...editForm, wakeTime: e.target.value })}
                      className="w-full px-2 py-1.5 rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={2}
                    className="w-full px-2 py-1.5 rounded border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm text-surface-900 dark:text-surface-50"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm rounded-lg transition-colors">
                    Save
                  </button>
                  <button onClick={handleCancel} className="px-3 py-1.5 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 text-sm rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )
          }

          return (
            <div key={log.id} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <Moon size={18} className="text-primary-500 shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-surface-900 dark:text-surface-50">{log.date}</span>
                    <span className="text-xs text-surface-500">{log.bedtime} → {log.wakeTime}</span>
                    <span className="text-xs text-surface-500">({duration.toFixed(1)}h)</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Star key={n} size={12} className={n <= log.qualityRating ? 'fill-yellow-400 text-yellow-400' : 'text-surface-300 dark:text-surface-600'} />
                    ))}
                    {log.notes && <span className="text-xs text-surface-400 ml-2 truncate">{log.notes}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleEdit(log)}
                  className="p-1.5 text-primary-500 hover:text-primary-600 transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => { vibrate('tap'); playSound('twinkle'); deleteSleepLog(log.id) }}
                  className="p-1.5 text-red-500 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
