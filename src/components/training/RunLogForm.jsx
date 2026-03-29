import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { getToday } from '../../utils/dateHelpers'

const RUN_TYPES = [
  { value: 'easy', label: 'Easy' },
  { value: 'tempo', label: 'Tempo' },
  { value: 'interval', label: 'Interval' },
  { value: 'long_run', label: 'Long Run' },
  { value: 'race', label: 'Race' },
]

const initialForm = () => ({
  date: getToday(),
  type: 'easy',
  distanceKm: '',
  durationMinutes: '',
  intensity: 5,
  sorenessLevel: 2,
  notes: '',
})

export default function RunLogForm({ onSuccess } = {}) {
  const { addTrainingLog } = useApp()
  const [form, setForm] = useState(initialForm)
  const [showSuccess, setShowSuccess] = useState(false)

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    addTrainingLog({
      date: form.date,
      type: form.type,
      distanceKm: parseFloat(form.distanceKm),
      durationMinutes: parseInt(form.durationMinutes, 10),
      intensity: form.intensity,
      sorenessLevel: form.sorenessLevel,
      notes: form.notes.trim(),
    })

    setShowSuccess(true)
    setForm(initialForm())
    setTimeout(() => {
      setShowSuccess(false)
      onSuccess?.()
    }, 1500)
  }

  const inputClass =
    'w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 px-3 py-2 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500'

  return (
    <Card title="Log a Run" subtitle="Record your training session">
      {showSuccess && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle className="h-4 w-4" />
          Training logged successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              className={inputClass}
            >
              {RUN_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Distance (km)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={form.distanceKm}
              onChange={(e) => update('distanceKm', e.target.value)}
              placeholder="0.0"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Duration (min)
            </label>
            <input
              type="number"
              min="1"
              value={form.durationMinutes}
              onChange={(e) => update('durationMinutes', e.target.value)}
              placeholder="0"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Intensity (RPE):{' '}
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              {form.intensity}/10
            </span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={form.intensity}
            onChange={(e) => update('intensity', parseInt(e.target.value, 10))}
            className="w-full accent-primary-600"
          />
          <div className="flex justify-between text-xs text-surface-400">
            <span>Easy</span>
            <span>Maximal</span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Soreness Level:{' '}
            <span className="font-semibold text-primary-600 dark:text-primary-400">
              {form.sorenessLevel}/5
            </span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={form.sorenessLevel}
            onChange={(e) => update('sorenessLevel', parseInt(e.target.value, 10))}
            className="w-full accent-primary-600"
          />
          <div className="flex justify-between text-xs text-surface-400">
            <span>None</span>
            <span>Very sore</span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Notes (optional)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows={2}
            placeholder="How did it feel?"
            className={inputClass}
          />
        </div>

        <Button type="submit" className="w-full">
          Log Training
        </Button>
      </form>
    </Card>
  )
}
