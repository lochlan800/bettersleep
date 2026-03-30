import { useState } from 'react'
import { CheckCircle, Info, X } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { getToday } from '../../utils/dateHelpers'

const RUN_TYPES = [
  { value: 'easy_long', label: 'Easy Long Run' },
  { value: 'short_intervals', label: 'Short Intervals' },
  { value: 'long_intervals', label: 'Long Intervals' },
  { value: 'park_run', label: 'Park Run' },
  { value: 'sprints', label: 'Sprints' },
  { value: 'strength', label: 'Strength Training' },
]

const CR10_SCALE = [
  { value: 0, label: 'Rest', description: 'No exertion at all', color: 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400' },
  { value: 1, label: 'Very Easy', description: 'Very light activity, barely noticeable', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
  { value: 2, label: 'Easy', description: 'Light effort, comfortable pace, can hold a full conversation', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
  { value: 3, label: 'Moderate', description: 'Steady effort, can speak in full sentences', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' },
  { value: 4, label: 'Somewhat Hard', description: 'Starting to breathe harder, conversation becomes choppy', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
  { value: 5, label: 'Hard', description: 'Challenging effort, can only speak a few words at a time', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
  { value: 6, label: 'Very Hard', description: 'Vigorous effort, short phrases only', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
  { value: 7, label: 'Very Hard +', description: 'Very vigorous, difficult to speak at all', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
  { value: 8, label: 'Extremely Hard', description: 'Extremely strong effort, pushing your limits', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  { value: 9, label: 'Near Max', description: 'Almost all-out, can barely continue', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  { value: 10, label: 'Maximal', description: 'Absolute maximum effort, cannot continue', color: 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300' },
]

const initialForm = () => ({
  date: getToday(),
  type: 'easy_long',
  distanceKm: '',
  durationMinutes: '',
  intensity: 3,
  sorenessLevel: 2,
  notes: '',
})

export default function RunLogForm({ onSuccess, initialData, editMode, onSave } = {}) {
  const { addTrainingLog } = useApp()
  const [form, setForm] = useState(() =>
    initialData
      ? {
          date: initialData.date,
          type: initialData.type,
          distanceKm: String(initialData.distanceKm),
          durationMinutes: String(initialData.durationMinutes),
          intensity: initialData.intensity,
          sorenessLevel: initialData.sorenessLevel,
          notes: initialData.notes || '',
        }
      : initialForm()
  )
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCR10Info, setShowCR10Info] = useState(false)

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = {
      date: form.date,
      type: form.type,
      distanceKm: parseFloat(form.distanceKm),
      durationMinutes: parseInt(form.durationMinutes, 10),
      intensity: form.intensity,
      sorenessLevel: form.sorenessLevel,
      notes: form.notes.trim(),
    }

    if (editMode && onSave) {
      onSave(data)
      return
    }

    addTrainingLog(data)

    setShowSuccess(true)
    setForm(initialForm())
    setTimeout(() => {
      setShowSuccess(false)
      onSuccess?.()
    }, 1500)
  }

  const selected = CR10_SCALE[form.intensity]

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

        {/* Foster Modified CR10 RPE Scale */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
              Session RPE (CR10 Scale)
            </label>
            <button
              type="button"
              onClick={() => setShowCR10Info(!showCR10Info)}
              className="text-surface-400 hover:text-primary-500 transition-colors"
              title="What is the CR10 scale?"
            >
              <Info size={16} />
            </button>
          </div>

          {/* CR10 Info Panel */}
          {showCR10Info && (
            <div className="mb-3 rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-semibold text-primary-800 dark:text-primary-300">Foster's Modified CR10 Scale</h4>
                <button type="button" onClick={() => setShowCR10Info(false)} className="text-primary-400 hover:text-primary-600">
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-primary-700 dark:text-primary-400 mb-2">
                The CR10 (Category Ratio 10) scale was developed by Gunnar Borg and modified by Carl Foster
                for monitoring training load in athletes. Unlike heart rate, it captures the <strong>overall
                session difficulty</strong> — including physical, mental, and environmental factors.
              </p>
              <p className="text-xs text-primary-700 dark:text-primary-400 mb-2">
                <strong>How to use it:</strong> About 30 minutes after your session, ask yourself:
                "How hard was that workout overall?" Then select the descriptor that best matches your
                perceived effort for the <em>entire</em> session, not just the hardest part.
              </p>
              <p className="text-xs text-primary-700 dark:text-primary-400">
                <strong>Why it matters:</strong> Your session RPE multiplied by duration gives your
                training load (sRPE method). This is used to calculate your acute:chronic workload ratio
                — a key metric for managing training stress and reducing injury risk.
              </p>
            </div>
          )}

          {/* Selected RPE display */}
          <div className={`rounded-lg p-3 mb-2 ${selected.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold">{selected.value}</span>
                <span className="text-sm font-semibold ml-2">{selected.label}</span>
              </div>
              <span className="text-xs font-medium opacity-80">
                Load: {form.durationMinutes ? `${parseInt(form.durationMinutes, 10) * selected.value}` : '—'}
              </span>
            </div>
            <p className="text-xs mt-1 opacity-90">{selected.description}</p>
          </div>

          {/* RPE selector buttons */}
          <div className="grid grid-cols-11 gap-1">
            {CR10_SCALE.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => update('intensity', level.value)}
                className={`h-10 rounded-md text-xs font-bold transition-all ${
                  form.intensity === level.value
                    ? 'ring-2 ring-primary-500 ring-offset-1 dark:ring-offset-surface-800 scale-110 ' + level.color
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
                title={`${level.value} — ${level.label}`}
              >
                {level.value}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-surface-400 mt-1 px-0.5">
            <span>Rest</span>
            <span>Moderate</span>
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
          {editMode ? 'Save Changes' : 'Log Training'}
        </Button>
      </form>
    </Card>
  )
}
