import { useState } from 'react'
import {
  MonitorOff, NotebookPen, Bath, Wind, StretchHorizontal,
  Armchair, BookOpen, HeartPulse, Moon, Info, Sparkles,
} from 'lucide-react'
import Card from '../ui/Card'
import useLocalStorage from '../../hooks/useLocalStorage'
import { useApp } from '../../context/AppContext'
import { getSleepNeed } from '../../utils/ageGuidance'
import { addMinutesToTime, formatTime12 } from '../../utils/timeOfDay'

// Ten-minute blocks counting down to lights out. `before` is minutes before
// bedtime, so the whole routine is anchored to when you actually want to be
// asleep rather than when you start it.
const STEPS = [
  {
    before: 90, icon: MonitorOff, task: 'Digital shutdown',
    detail: 'Turn off bright screens, computers, and overhead lights. Switch to dim, warm lamplight.',
    why: 'Stops blue light suppressing melatonin, and prevents the cortisol and heart-rate spikes that come with it.',
  },
  {
    before: 80, icon: NotebookPen, task: 'Brain dump',
    detail: 'Sit with a paper notebook and write down every task, worry, or thought for tomorrow.',
    why: 'Clears mental load so rumination does not keep your sympathetic nervous system switched on later.',
  },
  {
    before: 70, icon: Bath, task: 'Warm bath or shower',
    detail: 'Ten minutes in warm water.',
    why: 'Widens the blood vessels near your skin, setting your body up to dump core heat fast once you get out.',
  },
  {
    before: 60, icon: Wind, task: 'Cool down and hygiene',
    detail: 'Dry off, loose clothing, brush your teeth, and finish your night routine in dim light.',
    why: 'As core temperature falls in the cooler air, blood pressure and resting heart rate start a steady decline.',
  },
  {
    before: 50, icon: StretchHorizontal, task: 'Gentle static stretching',
    detail: 'Slow stretches for hips, hamstrings, and neck. Hold each for 30-60 seconds. Never bounce.',
    why: 'Releases stored muscular tension and signals physical safety to your autonomic nervous system.',
  },
  {
    before: 40, icon: Armchair, task: 'Legs up the wall',
    detail: 'Lie flat on your back with your legs resting vertically against a wall.',
    why: 'Pushes blood back toward the heart, triggering the baroreflex that automatically slows your pulse.',
  },
  {
    before: 30, icon: BookOpen, task: 'Low-stimulation reading',
    detail: 'A physical book or e-ink reader, in a dim armchair or in bed. Nothing gripping.',
    why: 'Moves your focus off internal stressors while keeping mental arousal low.',
  },
  {
    before: 20, icon: HeartPulse, task: 'Extended exhale breathing',
    detail: '4-7-8 breathing, or physiological sighs — double inhale through the nose, long single exhale through the mouth.',
    why: 'Stimulates the vagus nerve directly, releasing acetylcholine which slows the heart\'s own pacemaker.',
  },
  {
    before: 10, icon: Sparkles, task: 'Muscle relaxation, then lights out',
    detail: 'Lights off, under the covers. Tense then release each muscle group from toes to head.',
    why: 'Clears the last residual muscle tension so heart rate and breathing settle to their resting baseline.',
  },
  {
    before: 0, icon: Moon, task: 'Asleep',
    detail: 'Lights out and settled.',
    why: 'Deep sleep is when growth hormone is released and your muscles actually rebuild.',
  },
]

const ROUTINE_MINUTES = 90
// Mirrors the Morning Routine, which works backwards from your leave time.
const MORNING_ROUTINE_MINUTES = 100

export default function NightRoutine() {
  const { settings } = useApp()
  const [leaveTime] = useLocalStorage('bs_leave_time', '07:40')
  const [override, setOverride] = useLocalStorage('bs_bedtime_override', null)
  const [showWhy, setShowWhy] = useState(true)

  const age = settings.realAge
  const need = getSleepNeed(age)

  // Default bedtime is derived from the same leave time the Morning Routine
  // uses, minus the sleep this age actually needs — so the two line up.
  const wakeTime = addMinutesToTime(leaveTime, -MORNING_ROUTINE_MINUTES)
  const recommendedBedtime = addMinutesToTime(wakeTime, -Math.round(need.ideal * 60))
  const bedtime = override || recommendedBedtime
  const usingRecommended = !override || override === recommendedBedtime

  const startTime = addMinutesToTime(bedtime, -ROUTINE_MINUTES)
  const steps = STEPS.map(s => ({ ...s, time: addMinutesToTime(bedtime, -s.before) }))

  return (
    <Card
      title="Night Routine"
      subtitle="90 minutes of winding down, counted back from lights out"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300">
          <span className="font-medium">Lights out at</span>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setOverride(e.target.value)}
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
          <p className="font-semibold">Start winding down at {formatTime12(startTime)} to be asleep by {formatTime12(bedtime)}.</p>
          <p className="mt-1 opacity-80">
            {usingRecommended
              ? `That gives you ${need.ideal} hours before your ${formatTime12(wakeTime)} wake-up${age ? `, which is what you need at ${age}` : ''}.`
              : `Your recommended bedtime is ${formatTime12(recommendedBedtime)} for a ${formatTime12(wakeTime)} wake-up.`}
          </p>
          {!usingRecommended && (
            <button
              onClick={() => setOverride(null)}
              className="mt-1.5 text-[11px] font-medium underline"
            >
              Use recommended bedtime
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isLast = i === steps.length - 1
          return (
            <div key={step.before} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className={`p-2 rounded-full shrink-0 ${isLast ? 'bg-indigo-500/15' : 'bg-accent-500/10'}`}>
                  <Icon size={16} className={isLast ? 'text-indigo-500' : 'text-accent-500'} />
                </div>
                {!isLast && <div className="w-px flex-1 bg-surface-200 dark:bg-surface-700 mt-1 min-h-4" />}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-bold text-surface-900 dark:text-surface-50 tabular-nums">{formatTime12(step.time)}</span>
                  <span className="text-sm text-surface-700 dark:text-surface-300">{step.task}</span>
                  {!isLast && (
                    <span className="text-[10px] text-surface-400">{step.before} min before</span>
                  )}
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{step.detail}</p>
                {showWhy && (
                  <p className="text-xs text-primary-600/80 dark:text-primary-400/80 mt-1 flex items-start gap-1.5">
                    <Info size={11} className="mt-0.5 shrink-0" />
                    <span>{step.why}</span>
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-[11px] text-surface-400 mt-2">
        Each step is a 10-minute block. The goal is a steady drop in heart rate rather than any single trick.
      </p>
    </Card>
  )
}
