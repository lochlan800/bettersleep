import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useApp } from '../../context/AppContext'
import { calculateSleepScore, calculateRecoveryScore, calculateACWR, calculateFatigueScore } from '../../utils/scoring'
import { formatDate, getDaysAgo } from '../../utils/dateHelpers'
import stretches from '../../data/stretches'
import Card from '../ui/Card'
import { getFreeSugar } from '../../utils/freeSugar'

function getColor(score) {
  if (score >= 80) return '#14b8a6'
  if (score >= 60) return '#eab308'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

export default function RecoveryScoreChart() {
  const { sleepLogs, trainingLogs, hydrationLogs, mindfulnessLogs, stretchingLogs, sorenessLogs, mealCompletions, foodLog, goals } = useApp()

  const chartData = useMemo(() => {
    const data = []

    // Calculate ACWR reliability once (same for all days in the chart)
    const trainingDates = trainingLogs.map(l => new Date(l.date)).sort((a, b) => a - b)
    const trainingSpanDays = trainingDates.length >= 2
      ? Math.round((trainingDates[trainingDates.length - 1] - trainingDates[0]) / (1000 * 60 * 60 * 24))
      : 0
    const acwr = calculateACWR(trainingLogs)
    const fatigueScore = calculateFatigueScore(acwr)
    const chronicLoad = trainingLogs.length >= 4 ? 1 : 0
    const hasReliableACWR = chronicLoad > 0 && trainingLogs.length >= 4 && trainingSpanDays >= 14

    for (let i = 6; i >= 0; i--) {
      const dateStr = getDaysAgo(i)

      // Sleep score — only use that day's log (matches useRecoveryScore reset behavior)
      const daySleep = sleepLogs.find(l => l.date === dateStr)
      const sortedSleep = [...sleepLogs].sort((a, b) => b.date.localeCompare(a.date))
      const recentSleep = sortedSleep.slice(0, 7)
      const sleepScore = daySleep ? calculateSleepScore(daySleep, recentSleep) : 0

      // Soreness — prefer standalone soreness log, fall back to training log
      const daySorenessLog = sorenessLogs.find(d => d.date === dateStr)
      const trainingUpToDate = trainingLogs.filter(l => l.date <= dateStr)
      const sortedTraining = [...trainingUpToDate].sort((a, b) => b.date.localeCompare(a.date))
      const latestSoreness = daySorenessLog?.level ?? sortedTraining[0]?.sorenessLevel ?? 1

      // Hydration for this day
      const dayHydration = hydrationLogs.find(d => d.date === dateStr)
      const totalMl = dayHydration ? dayHydration.entries.reduce((sum, e) => sum + (e.amountMl ?? 0), 0) : 0
      const hydrationPercent = Math.min(100, Math.round((totalMl / 2000) * 100))

      // Mindfulness for this day
      const dayMindfulness = mindfulnessLogs.find(d => d.date === dateStr)
      const mindfulnessCount = dayMindfulness ? dayMindfulness.activities.length : 0

      // Stretching for this day
      const dayStretching = stretchingLogs.find(d => d.date === dateStr)
      const stretchingDone = dayStretching ? dayStretching.completed.length : 0
      const stretchingPercent = stretches.length > 0 ? Math.round((stretchingDone / stretches.length) * 100) : 0

      // Nutrition — from food log
      const dayFoodEntries = foodLog.filter(e => e.date === dateStr)
      const dayFoodGroups = new Set()
      let dayFreeSugar = 0
      dayFoodEntries.forEach(e => {
        ;(e.groups || []).forEach(g => dayFoodGroups.add(g))
        dayFreeSugar += getFreeSugar(e)
      })
      const dayGroupScore = dayFoodEntries.length > 0 ? Math.round((dayFoodGroups.size / 5) * 100) : 0
      const daySugarOk = dayFreeSugar <= 30 ? 100 : Math.max(0, 100 - (dayFreeSugar - 30) * 5)
      const dayHasFood = dayFoodEntries.length > 0 ? 100 : 0
      const dayNutritionPercent = dayFoodEntries.length > 0
        ? Math.round(dayGroupScore * 0.6 + daySugarOk * 0.2 + dayHasFood * 0.2)
        : -1

      // Fall back to old meal completions
      const dayMeals = mealCompletions.find(d => d.date === dateStr)
      const mealsEatenCount = dayMeals ? dayMeals.completed.length : 0

      // Goals check-in for this day
      const activeGoals = (goals || []).filter(g => !g.completed)
      const goalsCheckedDay = activeGoals.filter(
        g => g.dailyCheckins && g.dailyCheckins.includes(dateStr)
      ).length
      const goalCheckinPercent = activeGoals.length > 0
        ? Math.round((goalsCheckedDay / activeGoals.length) * 100)
        : 0

      const score = calculateRecoveryScore({
        sleepScore,
        fatigueScore,
        hydrationPercent,
        sorenessLevel: latestSoreness,
        hasReliableACWR,
        mindfulnessCount,
        stretchingPercent,
        mealsEatenCount,
        nutritionPercent: dayNutritionPercent,
        goalCheckinPercent,
      })

      data.push({
        date: dateStr,
        label: formatDate(dateStr),
        score,
      })
    }

    return data
  }, [sleepLogs, trainingLogs, hydrationLogs, mindfulnessLogs, stretchingLogs, sorenessLogs, mealCompletions, foodLog, goals])

  const hasData = chartData.some(d => d.score > 0)

  return (
    <Card title="Recovery Trend" subtitle="Last 7 days">
      {!hasData ? (
        <p className="text-center text-sm text-surface-500 dark:text-surface-400 py-8">
          Log some data to see your recovery trend over the week.
        </p>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <defs>
                <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} className="text-surface-500" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} className="text-surface-500" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg, #fff)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                formatter={(value) => [`${value}/100`, 'Recovery']}
              />
              <ReferenceLine y={80} stroke="#14b8a6" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine y={40} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#14b8a6"
                strokeWidth={2}
                fill="url(#recoveryGradient)"
                dot={{ r: 4, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  )
}
