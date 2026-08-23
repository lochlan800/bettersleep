import { useState } from 'react'
import { Sun, Activity, Droplets, Sparkles, Utensils, Backpack, Clock, LogOut, Moon, Info } from 'lucide-react'
import Card from '../ui/Card'
import useLocalStorage from '../../hooks/useLocalStorage'

const STEPS = [
  { offset: 0,  icon: Sun,       task: 'Wake up + drink a glass of water',      why: 'Rehydrate from the night — grogginess is often mild dehydration.' },
  { offset: 5,  icon: Sun,       task: 'Toilet, then step outside for daylight', why: 'Sunlight in your eyes within 10-30 min locks in your circadian clock so melatonin releases on time tonight.' },
  { offset: 15, icon: Activity,  task: 'Physical activity — walk, run, or stretches', why: 'Pushes cortisol to peak now instead of later, so your evening feels naturally calmer.' },
  { offset: 30, icon: Droplets,  task: 'Shower (finish with 30s cold)',          why: 'Cold finish spikes alertness for the school day.' },
  { offset: 45, icon: Sparkles,  task: 'Skincare + brush teeth',                 why: 'Cleanser, moisturiser, SPF if it\'s sunny. Fluoride toothpaste for 2 min.' },
  { offset: 55, icon: Utensils,  task: 'Breakfast — protein + complex carbs',    why: 'Eggs, oats, or Greek yoghurt. Steady energy for morning classes without a sugar crash.' },
  { offset: 70, icon: Backpack,  task: 'Get dressed, pack school bag',           why: 'Check today\'s timetable, PE kit, and homework.' },
  { offset: 85, icon: Clock,     task: 'Buffer time — review notes or just relax', why: 'Extra time means you arrive calm, not stressed and rushed.' },
  { offset: 100, icon: LogOut,   task: 'Leave for school',                       why: 'On time, fed, and awake.' },
]

const ROUTINE_MINUTES = 100

function addMinutesToTime(timeStr, mins) {
  const [h, m] = timeStr.split(':').map(Number)
  const total = h * 60 + m + mins
  const wrapped = ((total % 1440) + 1440) % 1440
  const th = Math.floor(wrapped / 60)
  const tm = wrapped % 60
  return `${String(th).padStart(2, '0')}:${String(tm).padStart(2, '0')}`
}

function formatTime12(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

export default function MorningRoutine() {
  const [leaveTime, setLeaveTime] = useLocalStorage('bs_leave_time', '07:40')
  const [showWhy, setShowWhy] = useState(true)

  const wakeTime = addMinutesToTime(leaveTime, -ROUTINE_MINUTES)
  const bedTimeEarly = addMinutesToTime(wakeTime, -10 * 60)
  const bedTimeLate = addMinutesToTime(wakeTime, -9 * 60)

  const steps = STEPS.map(s => ({
    ...s,
    time: addMinutesToTime(wakeTime, s.offset),
  }))

  return (
    <Card
      title="Morning Routine"
      subtitle="Built backwards from when you leave — uses the sleep science on this page"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300">
          <span className="font-medium">Leave for school at</span>
          <input
            type="time"
            value={leaveTime}
            onChange={(e) => setLeaveTime(e.target.value)}
            className="bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-lg px-2 py-1 text-sm text-surface-900 dark:text-surface-50"
          />
        </label>
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="text-xs text-primary-600 dark:text-primary-400 hover:underline sm:ml-auto"
        >
          {showWhy ? 'Hide why' : 'Show why'}
        </button>
      </div>

      <div className="p-3 mb-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-start gap-2.5">
        <Moon size={16} className="text-primary-600 dark:text-primary-400 mt-0.5 shrink-0" />
        <div className="text-xs text-primary-700 dark:text-primary-300">
          <p className="font-semibold">To wake up naturally at {formatTime12(wakeTime)}, get to bed between {formatTime12(bedTimeLate)} and {formatTime12(bedTimeEarly)}.</p>
          <p className="mt-1 opacity-80">Teens (13-18) need 8-10 hours of sleep — 9 hours is the sweet spot for recovery and focus at school.</p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isLast = i === steps.length - 1
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className={`p-2 rounded-full shrink-0 ${isLast ? 'bg-emerald-500/15' : 'bg-accent-500/10'}`}>
                  <Icon size={16} className={isLast ? 'text-emerald-600 dark:text-emerald-400' : 'text-accent-500'} />
                </div>
                {!isLast && <div className="w-px flex-1 bg-surface-200 dark:bg-surface-700 mt-1 min-h-4" />}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-surface-900 dark:text-surface-50 tabular-nums">{formatTime12(step.time)}</span>
                  <span className="text-sm text-surface-700 dark:text-surface-300">{step.task}</span>
                </div>
                {showWhy && (
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 flex items-start gap-1.5">
                    <Info size={11} className="mt-0.5 shrink-0" />
                    <span>{step.why}</span>
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-[11px] text-surface-400 mt-2">Total routine: {ROUTINE_MINUTES} minutes from wake-up to leaving.</p>
    </Card>
  )
}
