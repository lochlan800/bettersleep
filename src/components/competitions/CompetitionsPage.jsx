import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Trophy, Plus, Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react'
import { getToday } from '../../utils/dateHelpers'
import { vibrate } from '../../utils/vibrate'
import { playSound } from '../../utils/playSound'

const EVENTS = [
  { id: '50m', label: '50m', category: 'Sprint' },
  { id: '100m', label: '100m', category: 'Sprint' },
  { id: '200m', label: '200m', category: 'Sprint' },
  { id: '400m', label: '400m', category: 'Sprint' },
  { id: '800m', label: '800m', category: 'Middle Distance' },
  { id: '1500m', label: '1500m', category: 'Middle Distance' },
  { id: 'parkrun', label: 'Park Run (5K)', category: 'Distance' },
]

const PLACEMENT_OPTIONS = [
  { value: '1st', label: '1st Place' },
  { value: '2nd', label: '2nd Place' },
  { value: '3rd', label: '3rd Place' },
  { value: 'top10', label: 'Top 10' },
  { value: 'top25', label: 'Top 25%' },
  { value: 'top50', label: 'Top 50%' },
  { value: 'finished', label: 'Finished' },
  { value: 'dnf', label: 'Did Not Finish' },
]

const REFLECTION_QUESTIONS = [
  { id: 'overall', label: 'How well do you think you performed overall?', type: 'rating' },
  { id: 'pacing', label: 'How was your pacing throughout the race?', type: 'rating' },
  { id: 'start', label: 'How was your start/reaction?', type: 'rating' },
  { id: 'mental', label: 'How strong was your mental game?', type: 'rating' },
  { id: 'physical', label: 'How did your body feel during the race?', type: 'rating' },
  { id: 'technique', label: 'How was your running form/technique?', type: 'rating' },
  { id: 'preparation', label: 'How well did your training prepare you?', type: 'rating' },
  { id: 'notes', label: 'Any other thoughts or things to work on?', type: 'text' },
]

const RATING_LABELS = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent']

function formatTime(seconds) {
  if (!seconds) return '--'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs.toFixed(2)}s`
  return `${mins}:${secs.toFixed(2).padStart(5, '0')}`
}

export default function CompetitionsPage() {
  const { competitionLogs, addCompetitionLog, updateCompetitionLog, deleteCompetitionLog } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  // Form state
  const [date, setDate] = useState(getToday())
  const [event, setEvent] = useState('100m')
  const [competitionName, setCompetitionName] = useState('')
  const [timeMinutes, setTimeMinutes] = useState('')
  const [timeSeconds, setTimeSeconds] = useState('')
  const [placement, setPlacement] = useState('finished')
  const [personalBest, setPersonalBest] = useState(false)
  const [ratings, setRatings] = useState({
    overall: 3, pacing: 3, start: 3, mental: 3, physical: 3, technique: 3, preparation: 3,
  })
  const [notes, setNotes] = useState('')

  const resetForm = () => {
    setDate(getToday())
    setEvent('100m')
    setCompetitionName('')
    setTimeMinutes('')
    setTimeSeconds('')
    setPlacement('finished')
    setPersonalBest(false)
    setRatings({ overall: 3, pacing: 3, start: 3, mental: 3, physical: 3, technique: 3, preparation: 3 })
    setNotes('')
  }

  const handleEdit = (log) => {
    setEditingId(log.id)
    setDate(log.date)
    setEvent(log.event)
    setCompetitionName(log.competitionName || '')
    const mins = log.timeSeconds ? Math.floor(log.timeSeconds / 60) : ''
    const secs = log.timeSeconds ? (log.timeSeconds % 60) : ''
    setTimeMinutes(mins === 0 && secs ? '' : String(mins))
    setTimeSeconds(secs ? String(secs) : '')
    setPlacement(log.placement)
    setPersonalBest(log.personalBest)
    setRatings({ ...log.ratings })
    setNotes(log.notes || '')
    setShowForm(true)
    setExpandedId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const totalSeconds = (parseFloat(timeMinutes || 0) * 60) + parseFloat(timeSeconds || 0)
    const data = {
      date,
      event,
      competitionName: competitionName.trim() || null,
      timeSeconds: totalSeconds > 0 ? totalSeconds : null,
      placement,
      personalBest,
      ratings: { ...ratings },
      notes: notes.trim() || null,
    }
    if (editingId) {
      updateCompetitionLog(editingId, data)
      setEditingId(null)
    } else {
      addCompetitionLog(data)
    }
    vibrate('success')
    playSound('explosion')
    resetForm()
    setShowForm(false)
  }

  const avgRating = (log) => {
    const vals = Object.values(log.ratings).filter(v => typeof v === 'number')
    if (vals.length === 0) return 0
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
  }

  const sortedLogs = [...(competitionLogs || [])].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="pb-20 lg:pb-4">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="text-amber-500" size={28} />
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Competitions</h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Log Race
          </button>
        </div>

        {/* Log Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
            <h3 className="font-bold text-surface-900 dark:text-surface-50 mb-4">{editingId ? 'Edit Competition' : 'Log a Competition'}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
                />
              </div>

              {/* Event */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Event</label>
                <select
                  value={event}
                  onChange={e => setEvent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
                >
                  {EVENTS.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.label} ({ev.category})</option>
                  ))}
                </select>
              </div>

              {/* Competition name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Competition Name (optional)</label>
                <input
                  type="text"
                  value={competitionName}
                  onChange={e => setCompetitionName(e.target.value)}
                  placeholder="e.g. County Championships, Local Meet"
                  className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Time (optional)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    value={timeMinutes}
                    onChange={e => setTimeMinutes(e.target.value)}
                    placeholder="min"
                    className="w-20 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
                  />
                  <span className="text-surface-500">:</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={timeSeconds}
                    onChange={e => setTimeSeconds(e.target.value)}
                    placeholder="sec"
                    className="w-24 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
                  />
                </div>
              </div>

              {/* Placement */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Placement</label>
                <select
                  value={placement}
                  onChange={e => setPlacement(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
                >
                  {PLACEMENT_OPTIONS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personal Best */}
            <label className="flex items-center gap-2 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={personalBest}
                onChange={e => setPersonalBest(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">This was a Personal Best (PB)</span>
            </label>

            {/* Reflection questions */}
            <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-3">How did it go?</h4>
            <div className="space-y-4 mb-4">
              {REFLECTION_QUESTIONS.filter(q => q.type === 'rating').map(q => (
                <div key={q.id}>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">{q.label}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRatings(prev => ({ ...prev, [q.id]: val }))}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                          ratings[q.id] === val
                            ? 'bg-primary-500 text-white'
                            : 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-300 dark:hover:bg-surface-600'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-surface-500 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              ))}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Any other thoughts or things to work on?</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="What went well? What could you improve?"
                  className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Update Competition' : 'Save Competition'}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setEditingId(null); setShowForm(false) }}
                className="px-6 py-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Competition History */}
        {sortedLogs.length === 0 ? (
          <div className="text-center py-12 text-surface-500 dark:text-surface-400">
            <Trophy size={48} className="mx-auto mb-3 opacity-30" />
            <p>No competitions logged yet.</p>
            <p className="text-sm mt-1">Tap "Log Race" to record your first competition!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h3 className="font-semibold text-surface-700 dark:text-surface-300">Race History</h3>
            {sortedLogs.map(log => {
              const eventInfo = EVENTS.find(e => e.id === log.event) || { label: log.event, category: '' }
              const expanded = expandedId === log.id
              const avg = avgRating(log)
              const placementInfo = PLACEMENT_OPTIONS.find(p => p.value === log.placement)

              return (
                <div key={log.id} className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
                  {/* Summary row */}
                  <button
                    onClick={() => setExpandedId(expanded ? null : log.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex-shrink-0">
                        {log.personalBest ? (
                          <span className="text-2xl">🏆</span>
                        ) : (
                          <Trophy size={24} className="text-surface-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-surface-900 dark:text-surface-50">{eventInfo.label}</span>
                          <span className="text-xs bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 px-2 py-0.5 rounded">{eventInfo.category}</span>
                          {log.personalBest && (
                            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded font-semibold">PB</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-surface-500 dark:text-surface-400 mt-1">
                          <span>{log.date}</span>
                          {log.timeSeconds && <span>{formatTime(log.timeSeconds)}</span>}
                          {placementInfo && <span>{placementInfo.label}</span>}
                        </div>
                        {log.competitionName && (
                          <p className="text-sm text-surface-500 dark:text-surface-400 truncate">{log.competitionName}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-600 dark:text-primary-400">{avg}</div>
                        <div className="text-xs text-surface-500">avg rating</div>
                      </div>
                      {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {expanded && (
                    <div className="px-4 pb-4 border-t border-surface-200 dark:border-surface-700 pt-3">
                      <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-3">Self-Assessment</h4>
                      <div className="space-y-2 mb-4">
                        {REFLECTION_QUESTIONS.filter(q => q.type === 'rating').map(q => (
                          <div key={q.id} className="flex items-center justify-between">
                            <span className="text-sm text-surface-600 dark:text-surface-400">{q.label.replace('How well do you think you ', '').replace('How was your ', '').replace('How did your ', '').replace('How strong was your ', '').replace('?', '')}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(val => (
                                  <div
                                    key={val}
                                    className={`w-6 h-2 rounded-full ${
                                      val <= (log.ratings[q.id] || 0)
                                        ? 'bg-primary-500'
                                        : 'bg-surface-300 dark:bg-surface-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium text-surface-700 dark:text-surface-300 w-6 text-right">{log.ratings[q.id]}/5</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {log.notes && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1">Notes</h4>
                          <p className="text-sm text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-900 p-3 rounded-lg">{log.notes}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleEdit(log)}
                          className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 transition-colors"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => { vibrate('tap'); playSound('twinkle'); deleteCompetitionLog(log.id) }}
                          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
