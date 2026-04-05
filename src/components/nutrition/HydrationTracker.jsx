import { useState } from 'react'
import { Droplets, Plus, Clock, RotateCcw } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import ProgressBar from '../ui/ProgressBar'

import { playSound } from '../../utils/playSound'
import { useCelebration } from '../../context/CelebrationContext'
import { useApp } from '../../context/AppContext'
import { getToday, formatTime } from '../../utils/dateHelpers'
import { format } from 'date-fns'

const QUICK_AMOUNTS = [250, 500, 750]

function getCurrentTime() {
  return format(new Date(), 'HH:mm')
}

export default function HydrationTracker() {
  const { getTodayHydration, addHydrationEntry, resetTodayHydration } = useApp()
  const { triggerCelebration } = useCelebration()
  const [customAmount, setCustomAmount] = useState('')

  const todayLog = getTodayHydration()
  const totalMl = todayLog.entries.reduce((sum, e) => sum + e.amountMl, 0)

  const targetMl = 2000
  const percent = Math.min(Math.round((totalMl / targetMl) * 100), 100)

  const handleAdd = (amountMl) => {
    playSound('twinkle')
    triggerCelebration()
    addHydrationEntry(getToday(), {
      time: getCurrentTime(),
      amountMl,
    })
  }

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount, 10)
    if (!amount || amount <= 0) return
    handleAdd(amount)
    setCustomAmount('')
  }

  const handleCustomKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCustomAdd()
    }
  }

  return (
    <Card title="Hydration Tracker" subtitle="Stay on top of your daily water intake">
      <div className="space-y-5">
        {/* Progress section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <Droplets className="h-6 w-6 text-blue-500" />
            <span className="text-3xl font-bold text-surface-900 dark:text-surface-50">
              {totalMl}
            </span>
            <span className="text-lg text-surface-500 dark:text-surface-400">
              / {targetMl} ml
            </span>
          </div>
          <ProgressBar value={totalMl} max={targetMl} label="Daily Progress" showValue={false} />
          <div className="flex items-center justify-center gap-3 mt-1.5">
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {percent}% of daily target
            </p>
            {todayLog.entries.length > 0 && (
              <Button variant="ghost" size="sm" onClick={resetTodayHydration} className="!px-2 !py-1 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Quick-add buttons */}
        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Quick Add
          </p>
          <div className="flex gap-2">
            {QUICK_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => handleAdd(amount)}
              >
                <Droplets className="h-3.5 w-3.5" />
                +{amount}ml
              </Button>
            ))}
          </div>
        </div>

        {/* Custom amount input */}
        <div>
          <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Custom Amount
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              onKeyDown={handleCustomKeyDown}
              placeholder="Amount in ml"
              className="flex-1 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-700 px-3 py-2 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button size="md" onClick={handleCustomAdd} disabled={!customAmount}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Today's entries */}
        {todayLog.entries.length > 0 && (
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Today&apos;s Entries
            </p>
            <ul className="space-y-1.5 max-h-48 overflow-y-auto">
              {[...todayLog.entries].reverse().map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg bg-surface-50 dark:bg-surface-700/50 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTime(entry.time)}
                  </span>
                  <span className="font-medium text-surface-900 dark:text-surface-50">
                    {entry.amountMl} ml
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}
