import { useState } from 'react'
import { Moon, Droplets, Timer, Plus, ThermometerSun } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import ProgressBar from '../ui/ProgressBar'
import SleepLogForm from '../sleep/SleepLogForm'
import RunLogForm from '../training/RunLogForm'
import { calculateHydrationTarget, calculateSleepScore } from '../../utils/scoring'
import { getToday } from '../../utils/dateHelpers'

const SORENESS_LABELS = ['', 'None', 'Mild', 'Moderate', 'High', 'Severe']
const SORENESS_COLORS = ['', 'text-green-500', 'text-lime-500', 'text-yellow-500', 'text-orange-500', 'text-red-500']

export default function QuickLogWidgets() {
  const [sleepOpen, setSleepOpen] = useState(false)
  const [trainOpen, setTrainOpen] = useState(false)
  const { sleepLogs, trainingLogs, settings, getTodayHydration, addHydrationEntry, sorenessLogs, setTodaySoreness } = useApp()

  const sortedSleep = [...sleepLogs].sort((a, b) => b.date.localeCompare(a.date))
  const lastSleep = sortedSleep[0]
  const sleepScore = lastSleep ? Math.round(calculateSleepScore(lastSleep, sortedSleep.slice(0, 7))) : null
  const todayTraining = trainingLogs.find(l => l.date === getToday())
  const todayHydration = getTodayHydration()
  const hydrationTarget = calculateHydrationTarget(settings.bodyWeightKg, todayTraining?.durationMinutes ?? 0)
  const todaySoreness = sorenessLogs.find(d => d.date === getToday())?.level ?? null

  const add500 = () => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    addHydrationEntry(getToday(), { time, amountMl: 500 })
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Sleep widget */}
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Moon size={18} className="text-accent-500" />
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Sleep</span>
          </div>
          <p className="text-3xl font-bold text-surface-900 dark:text-surface-50">
            {sleepScore !== null ? sleepScore : '—'}
            {sleepScore !== null && <span className="text-sm font-normal text-surface-400">/100</span>}
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400">{lastSleep ? `Last: ${lastSleep.date}` : 'Not logged'}</p>
          <Button size="sm" variant="secondary" onClick={() => setSleepOpen(true)} className="mt-auto">
            <Plus size={14} /> Log
          </Button>
        </div>

        {/* Hydration widget */}
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Droplets size={18} className="text-blue-500" />
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Water</span>
          </div>
          <p className="text-3xl font-bold text-surface-900 dark:text-surface-50">
            {todayHydration.totalMl}<span className="text-sm font-normal text-surface-400">ml</span>
          </p>
          <ProgressBar value={todayHydration.totalMl} max={hydrationTarget} showValue={false} />
          <Button size="sm" variant="secondary" onClick={add500} className="mt-auto">
            <Plus size={14} /> +500ml
          </Button>
        </div>

        {/* Training widget */}
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Timer size={18} className="text-primary-600" />
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Training</span>
          </div>
          {todayTraining ? (
            <>
              <p className="text-3xl font-bold text-surface-900 dark:text-surface-50">{todayTraining.distanceKm}<span className="text-sm font-normal text-surface-400">km</span></p>
              <p className="text-xs text-surface-500 capitalize">{todayTraining.type.replace('_', ' ')} · RPE {todayTraining.intensity}</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-surface-400">—</p>
              <p className="text-xs text-surface-500 dark:text-surface-400">No run today</p>
            </>
          )}
          <Button size="sm" variant="secondary" onClick={() => setTrainOpen(true)} className="mt-auto">
            <Plus size={14} /> Log
          </Button>
        </div>

        {/* Soreness widget */}
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ThermometerSun size={18} className="text-orange-500" />
            <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">Soreness</span>
          </div>
          <p className={`text-2xl font-bold ${todaySoreness ? SORENESS_COLORS[todaySoreness] : 'text-surface-400'}`}>
            {todaySoreness ? SORENESS_LABELS[todaySoreness] : '—'}
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => setTodaySoreness(level)}
                className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                  todaySoreness === level
                    ? 'bg-primary-500 text-white'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-surface-400 flex justify-between"><span>None</span><span>Severe</span></p>
        </div>
      </div>

      <Modal isOpen={sleepOpen} onClose={() => setSleepOpen(false)} title="Log Sleep">
        <SleepLogForm onSuccess={() => setSleepOpen(false)} />
      </Modal>
      <Modal isOpen={trainOpen} onClose={() => setTrainOpen(false)} title="Log Run">
        <RunLogForm onSuccess={() => setTrainOpen(false)} />
      </Modal>
    </>
  )
}
