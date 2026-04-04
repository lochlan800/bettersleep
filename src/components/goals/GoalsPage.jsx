import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Target, Plus, Trash2, Pencil, ChevronDown, ChevronUp, Check, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react'
import { getToday } from '../../utils/dateHelpers'

const CATEGORIES = [
  { id: 'recovery', label: 'Recovery', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', emoji: '💚' },
  { id: 'training', label: 'Training', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', emoji: '🏃' },
  { id: 'performance', label: 'Performance', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', emoji: '🏆' },
]

const SMART_STEPS = [
  {
    key: 'category',
    title: 'What area is this goal for?',
    help: 'Choose whether this is about recovery (sleep, stretching, mindfulness), training (distance, frequency, consistency), or performance (race times, PBs, competitions).',
  },
  {
    key: 'specific',
    title: 'Specific — What exactly do you want to achieve?',
    help: "Be as precise as possible. Instead of \"run more\", say \"run 4 times per week\" or \"complete a park run\". The more specific, the clearer your target.\n\nExamples:\n• Recovery: \"Complete my stretching routine after every training session\"\n• Training: \"Run 4 times per week including one long run\"\n• Performance: \"Run a sub-25 minute park run\"",
  },
  {
    key: 'measurable',
    title: 'Measurable — How will you track progress?',
    help: "You need a number you can measure. This is how you'll know if you're on track and when you've succeeded.\n\nExamples:\n• \"Log at least 7 hours of sleep 5 nights per week\"\n• \"Hit a recovery score of 70+ at least 4 days per week\"\n• \"Reduce my 5K time by 1 minute\"",
  },
  {
    key: 'achievable',
    title: 'Achievable — Is this realistic for you right now?',
    help: "Think about your current fitness, schedule, and commitments. A goal should stretch you but not break you. If you're running twice a week, jumping to 7 days isn't achievable — but 3-4 is.\n\nAsk yourself:\n• Do I have the time for this?\n• Is my body ready for this?\n• What might get in the way?",
  },
  {
    key: 'relevant',
    title: 'Relevant — Why does this matter to you?',
    help: "Connect the goal to something you care about. A goal you don't care about won't stick.\n\nExamples:\n• \"I want to sleep better so I can train harder without getting injured\"\n• \"I want to run a sub-25 park run because it's been my target for months\"\n• \"I want to stretch daily because my hamstrings are always tight\"",
  },
  {
    key: 'timeBound',
    title: 'Time-bound — When will you achieve this by?',
    help: "Set a deadline. Without one, goals drift forever. Pick a realistic date — not too close (pressure) and not too far (no urgency).\n\nGuidelines:\n• Short-term goals: 2-4 weeks\n• Medium-term goals: 1-3 months\n• Long-term goals: 3-6 months",
  },
  {
    key: 'review',
    title: 'Review your SMART goal',
    help: 'Check everything looks right. You can go back and edit any step.',
  },
]

const SUGGESTION_TEMPLATES = {
  recovery: [
    { label: 'Sleep consistency', specific: 'Go to bed within 30 minutes of the same time every night', measurable: 'Log bedtime within my target window at least 5 out of 7 nights per week', achievable: 'I will set a phone alarm 30 minutes before my target bedtime as a reminder', relevant: '', timeBound: '' },
    { label: 'Daily stretching', specific: 'Complete my stretching routine after every training session', measurable: 'Tick off at least 6 stretches on every training day', achievable: 'I will stretch immediately after each run before I cool down', relevant: '', timeBound: '' },
    { label: 'Mindfulness habit', specific: 'Do at least one mindfulness activity every day', measurable: 'Complete at least 1 mindfulness activity on 6 out of 7 days per week', achievable: 'I will do 5 minutes of box breathing each morning before breakfast', relevant: '', timeBound: '' },
    { label: 'Hydration target', specific: 'Drink 2,000ml of water every day', measurable: 'Hit 100% of my water target at least 5 days per week', achievable: 'I will carry a water bottle with me and drink at set times throughout the day', relevant: '', timeBound: '' },
  ],
  training: [
    { label: 'Weekly distance', specific: 'Run a total of 20km per week', measurable: 'Track total weekly distance in my training logs and hit 20km', achievable: 'I will plan 3-4 runs per week with a mix of short and long sessions', relevant: '', timeBound: '' },
    { label: 'Consistent training', specific: 'Train at least 4 times per week', measurable: 'Log 4 or more training sessions every week', achievable: 'I will schedule my runs at the start of each week and protect those times', relevant: '', timeBound: '' },
    { label: 'Long run progression', specific: 'Build my long run from 5K to 10K', measurable: 'Increase my long run distance by 0.5-1km per week', achievable: 'I will only increase when my recovery score is Good or above', relevant: '', timeBound: '' },
  ],
  performance: [
    { label: 'Park Run PB', specific: 'Set a new personal best at park run', measurable: 'Beat my current park run time by at least 30 seconds', achievable: 'I will include one interval session per week to build speed', relevant: '', timeBound: '' },
    { label: 'Race goal', specific: 'Complete a specific race distance', measurable: 'Finish the race within my target time', achievable: 'I will follow a structured training plan building up to race day', relevant: '', timeBound: '' },
    { label: 'Sprint improvement', specific: 'Improve my 100m or 200m time', measurable: 'Reduce my time by a specific amount', achievable: 'I will include sprint drills and strength training twice per week', relevant: '', timeBound: '' },
  ],
}

function GoalWizard({ onSave, onCancel, editGoal }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(editGoal || {
    category: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timeBound: '',
    deadline: '',
  })
  const [showHelp, setShowHelp] = useState(true)

  const currentStep = SMART_STEPS[step]
  const isReview = currentStep.key === 'review'
  const canNext = isReview || (currentStep.key === 'category' ? form.category : form[currentStep.key]?.trim())

  const applyTemplate = (template) => {
    setForm(prev => ({
      ...prev,
      specific: template.specific,
      measurable: template.measurable,
      achievable: template.achievable,
      relevant: template.relevant || prev.relevant,
      timeBound: template.timeBound || prev.timeBound,
    }))
    setStep(1)
  }

  const handleSave = () => {
    onSave({
      ...form,
      completed: editGoal?.completed || false,
    })
  }

  return (
    <div className="p-4 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 mb-6">
      {/* Progress */}
      <div className="flex gap-1 mb-4">
        {SMART_STEPS.map((s, i) => (
          <div
            key={s.key}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < step ? 'bg-primary-500' : i === step ? 'bg-primary-300' : 'bg-surface-200 dark:bg-surface-700'
            }`}
          />
        ))}
      </div>

      {/* Step title */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-bold text-surface-900 dark:text-surface-50">
          Step {step + 1}/{SMART_STEPS.length}: {currentStep.title}
        </h3>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-primary-500 hover:text-primary-600 shrink-0"
          title="Toggle help"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      {/* Help text */}
      {showHelp && (
        <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm text-primary-800 dark:text-primary-300 whitespace-pre-line">
          {currentStep.help}
        </div>
      )}

      {/* Step content */}
      {currentStep.key === 'category' && (
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setForm({ ...form, category: cat.id })}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  form.category === cat.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                }`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <p className={`font-semibold mt-1 ${cat.color}`}>{cat.label}</p>
              </button>
            ))}
          </div>

          {form.category && (
            <div className="mt-4">
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Need inspiration? Start from a template:</p>
              <div className="flex flex-wrap gap-2">
                {(SUGGESTION_TEMPLATES[form.category] || []).map(t => (
                  <button
                    key={t.label}
                    onClick={() => applyTemplate(t)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep.key === 'specific' && (
        <textarea
          value={form.specific}
          onChange={e => setForm({ ...form, specific: e.target.value })}
          rows={3}
          placeholder="What exactly do you want to achieve?"
          className="w-full mb-4 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
        />
      )}

      {currentStep.key === 'measurable' && (
        <textarea
          value={form.measurable}
          onChange={e => setForm({ ...form, measurable: e.target.value })}
          rows={3}
          placeholder="What numbers will you track? How will you know you've succeeded?"
          className="w-full mb-4 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
        />
      )}

      {currentStep.key === 'achievable' && (
        <textarea
          value={form.achievable}
          onChange={e => setForm({ ...form, achievable: e.target.value })}
          rows={3}
          placeholder="What's your plan to make this happen? What could stop you?"
          className="w-full mb-4 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
        />
      )}

      {currentStep.key === 'relevant' && (
        <textarea
          value={form.relevant}
          onChange={e => setForm({ ...form, relevant: e.target.value })}
          rows={3}
          placeholder="Why does this goal matter to you personally?"
          className="w-full mb-4 px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
        />
      )}

      {currentStep.key === 'timeBound' && (
        <div className="space-y-3 mb-4">
          <textarea
            value={form.timeBound}
            onChange={e => setForm({ ...form, timeBound: e.target.value })}
            rows={2}
            placeholder="When will you achieve this by? What's your timeline?"
            className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
          />
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Deadline date</label>
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              min={getToday()}
              className="w-full px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-50"
            />
          </div>
        </div>
      )}

      {isReview && (
        <div className="space-y-3 mb-4">
          {[
            { label: 'Category', value: CATEGORIES.find(c => c.id === form.category)?.label },
            { label: 'Specific', value: form.specific },
            { label: 'Measurable', value: form.measurable },
            { label: 'Achievable', value: form.achievable },
            { label: 'Relevant', value: form.relevant },
            { label: 'Time-bound', value: form.timeBound + (form.deadline ? ` (by ${form.deadline})` : '') },
          ].map(({ label, value }, i) => (
            <div key={label} className="p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase">{label}</span>
                <button onClick={() => setStep(i)} className="text-xs text-primary-500 hover:text-primary-600">Edit</button>
              </div>
              <p className="text-sm text-surface-800 dark:text-surface-200">{value || '—'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
          >
            Cancel
          </button>
        </div>

        {isReview ? (
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Check size={16} /> Save Goal
          </button>
        ) : (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext}
            className={`flex items-center gap-1 px-6 py-2 rounded-lg transition-colors ${
              canNext
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-surface-200 dark:bg-surface-700 text-surface-400 cursor-not-allowed'
            }`}
          >
            Next <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

function daysUntil(deadline) {
  if (!deadline) return null
  const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp()
  const [showWizard, setShowWizard] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const handleSave = (goalData) => {
    if (editingId) {
      updateGoal(editingId, goalData)
      setEditingId(null)
    } else {
      addGoal(goalData)
    }
    setShowWizard(false)
  }

  const handleEdit = (goal) => {
    setEditingId(goal.id)
    setShowWizard(true)
    setExpandedId(null)
  }

  const handleCancel = () => {
    setShowWizard(false)
    setEditingId(null)
  }

  const sortedGoals = [...(goals || [])]
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const editGoal = editingId ? goals.find(g => g.id === editingId) : null

  const activeCount = sortedGoals.filter(g => !g.completed).length
  const completedCount = sortedGoals.filter(g => g.completed).length

  return (
    <div className="pb-20 lg:pb-4">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Target className="text-primary-500" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Goals</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400">SMART goals for recovery, training & performance</p>
            </div>
          </div>
          {!showWizard && (
            <button
              onClick={() => { setEditingId(null); setShowWizard(true) }}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              New Goal
            </button>
          )}
        </div>

        {/* Wizard */}
        {showWizard && (
          <GoalWizard
            onSave={handleSave}
            onCancel={handleCancel}
            editGoal={editGoal ? {
              category: editGoal.category,
              specific: editGoal.specific,
              measurable: editGoal.measurable,
              achievable: editGoal.achievable,
              relevant: editGoal.relevant,
              timeBound: editGoal.timeBound,
              deadline: editGoal.deadline || '',
              completed: editGoal.completed,
            } : null}
          />
        )}

        {/* Summary */}
        {sortedGoals.length > 0 && (
          <div className="flex gap-3 mb-4">
            <span className="text-sm text-surface-500 dark:text-surface-400">
              {activeCount} active {activeCount === 1 ? 'goal' : 'goals'}
            </span>
            {completedCount > 0 && (
              <span className="text-sm text-green-600 dark:text-green-400">
                {completedCount} completed
              </span>
            )}
          </div>
        )}

        {/* Goals list */}
        {sortedGoals.length === 0 && !showWizard ? (
          <div className="text-center py-12 text-surface-500 dark:text-surface-400">
            <Target size={48} className="mx-auto mb-3 opacity-30" />
            <p>No goals set yet.</p>
            <p className="text-sm mt-1">Tap "New Goal" and the wizard will walk you through creating a SMART goal step by step.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedGoals.map(goal => {
              const cat = CATEGORIES.find(c => c.id === goal.category) || CATEGORIES[0]
              const expanded = expandedId === goal.id
              const days = daysUntil(goal.deadline)
              const overdue = days !== null && days < 0 && !goal.completed

              return (
                <div
                  key={goal.id}
                  className={`rounded-lg border overflow-hidden ${
                    goal.completed
                      ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                      : overdue
                        ? 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700'
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(expanded ? null : goal.id)}
                    className="w-full p-4 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); updateGoal(goal.id, { completed: !goal.completed }) }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          goal.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-surface-300 dark:border-surface-600 hover:border-primary-500'
                        }`}
                      >
                        {goal.completed && <Check size={14} />}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded ${cat.bg} ${cat.color} font-medium`}>{cat.label}</span>
                          {goal.deadline && !goal.completed && (
                            <span className={`text-xs ${overdue ? 'text-red-500' : days <= 7 ? 'text-amber-500' : 'text-surface-500'}`}>
                              {overdue ? `${Math.abs(days)}d overdue` : `${days}d left`}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm font-medium mt-1 ${goal.completed ? 'line-through text-surface-500' : 'text-surface-900 dark:text-surface-50'}`}>
                          {goal.specific}
                        </p>
                      </div>
                    </div>
                    {expanded ? <ChevronUp size={18} className="shrink-0" /> : <ChevronDown size={18} className="shrink-0" />}
                  </button>

                  {expanded && (
                    <div className="px-4 pb-4 border-t border-surface-200 dark:border-surface-700 pt-3 space-y-2">
                      {[
                        { label: 'Specific', value: goal.specific },
                        { label: 'Measurable', value: goal.measurable },
                        { label: 'Achievable', value: goal.achievable },
                        { label: 'Relevant', value: goal.relevant },
                        { label: 'Time-bound', value: goal.timeBound + (goal.deadline ? ` (by ${goal.deadline})` : '') },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase">{label}</span>
                          <p className="text-sm text-surface-700 dark:text-surface-300">{value || '—'}</p>
                        </div>
                      ))}
                      <div className="flex items-center gap-4 pt-2">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 transition-colors"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={14} /> Delete
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
