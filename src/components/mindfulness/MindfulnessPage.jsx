import { useState, useMemo } from 'react'
import { Brain, Check, Sparkles } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { vibrate } from '../../utils/vibrate'
import { playSound } from '../../utils/playSound'
import { useCelebration } from '../../context/CelebrationContext'
import { getToday } from '../../utils/dateHelpers'

const ACTIVITIES = [
  {
    id: 'bilateral_tapping',
    name: 'Bilateral Tapping & Breathing',
    description: 'Close your eyes, put on bilateral music, and gently tap alternating sides of your body. Breathe in slowly for 4 counts, out for 6. Continue for 5-10 minutes.',
    duration: '5-10 min',
    category: 'Grounding',
  },
  {
    id: 'dark_bath',
    name: 'Dark Room Bath',
    description: 'Run a warm bath, turn off the lights, light some candles, and play bilateral music. Let yourself float and focus on the sound moving between ears. Stay for 15-20 minutes.',
    duration: '15-20 min',
    category: 'Deep Relaxation',
  },
  {
    id: 'terrarium',
    name: 'Make a Terrarium',
    description: 'Build or tend to a terrarium. The focused, gentle hand work is meditative. Choosing plants, arranging soil, and creating a small world calms the nervous system.',
    duration: '20-40 min',
    category: 'Creative',
  },
  {
    id: 'easy_run',
    name: 'Easy Mindful Run',
    description: 'Go for a slow, easy run with no music or watch. Focus on the feeling of your feet hitting the ground, your breathing rhythm, and your surroundings. No pace goals.',
    duration: '15-30 min',
    category: 'Movement',
  },
  {
    id: 'box_breathing',
    name: 'Box Breathing',
    description: 'Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat for 5 minutes. Used by Navy SEALs to regulate the nervous system under stress.',
    duration: '5 min',
    category: 'Breathing',
  },
  {
    id: 'body_scan',
    name: 'Body Scan',
    description: 'Lie down and slowly move your attention from your toes to the top of your head. Notice each body part without trying to change anything. Release tension as you go.',
    duration: '10-15 min',
    category: 'Grounding',
  },
  {
    id: 'journaling',
    name: 'Brain Dump Journal',
    description: 'Write down everything on your mind for 10 minutes without stopping or editing. Don\'t worry about grammar or sense. Just get it out of your head and onto paper.',
    duration: '10 min',
    category: 'Processing',
  },
  {
    id: 'cold_exposure',
    name: 'Cold Water Exposure',
    description: 'End your shower with 30-60 seconds of cold water. Focus on controlling your breathing through the shock. Builds mental resilience and activates the parasympathetic nervous system.',
    duration: '1-2 min',
    category: 'Resilience',
  },
  {
    id: 'nature_sit',
    name: 'Sit in Nature',
    description: 'Find a spot outside — a park, garden, or just your back step. Sit for 10 minutes and notice 5 things you can see, 4 you can hear, 3 you can feel, 2 you can smell, 1 you can taste.',
    duration: '10 min',
    category: 'Grounding',
  },
  {
    id: 'stretching_breathing',
    name: 'Stretch & Breathe',
    description: 'Do 5-10 minutes of gentle stretching paired with slow deep breathing. Hold each stretch for 30 seconds and exhale into the stretch. Focus on releasing rather than pushing.',
    duration: '5-10 min',
    category: 'Movement',
  },
  {
    id: 'music_listening',
    name: 'Active Music Listening',
    description: 'Put on headphones, choose one song or piece of music, close your eyes and listen to every detail — instruments, lyrics, dynamics. Give it your full attention. Nothing else.',
    duration: '5 min',
    category: 'Focus',
  },
  {
    id: 'gratitude',
    name: 'Gratitude Check-in',
    description: 'Write or mentally list 3 things you\'re grateful for today. Then list 1 thing about your training that went well, no matter how small. Reframes the mind toward progress.',
    duration: '3 min',
    category: 'Processing',
  },
]

const CATEGORY_COLORS = {
  Grounding: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  'Deep Relaxation': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  Creative: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Movement: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Breathing: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
  Processing: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  Resilience: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  Focus: 'bg-accent-400/20 text-accent-600 dark:text-accent-400',
}

export default function MindfulnessPage() {
  const { mindfulnessLogs, toggleMindfulnessActivity, getTodayMindfulness } = useApp()
  const { triggerCelebration } = useCelebration()

  const todayLog = getTodayMindfulness()
  const completedToday = todayLog.activities || []
  const completedCount = completedToday.length

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-7 w-7 text-accent-500" />
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Mindfulness</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Recover your mind — tick at least one activity each day
          </p>
        </div>
      </div>

      {/* Status card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Today's progress</p>
            <p className="text-3xl font-bold text-surface-900 dark:text-surface-50 mt-1">
              {completedCount}
              <span className="text-sm font-normal text-surface-400"> activities done</span>
            </p>
          </div>
          <div className={`p-3 rounded-full ${completedCount > 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            {completedCount > 0 ? (
              <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Brain className="h-6 w-6 text-red-500 dark:text-red-400" />
            )}
          </div>
        </div>
        {completedCount === 0 && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-3">
            You haven't done any mindfulness today. Pick at least one activity below — your mind needs recovery too.
          </p>
        )}
        {completedCount > 0 && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3">
            Great work looking after your mind today. This contributes to your recovery score.
          </p>
        )}
      </Card>

      {/* Activities grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACTIVITIES.map((activity) => {
          const done = completedToday.includes(activity.id)
          return (
            <button
              key={activity.id}
              onClick={() => { vibrate('tap'); if (!done) { playSound('twinkle'); triggerCelebration(); } toggleMindfulnessActivity(getToday(), activity.id) }}
              className={`text-left rounded-xl border p-4 transition-all ${
                done
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700'
                  : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:border-surface-300 dark:hover:border-surface-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`text-sm font-semibold ${done ? 'text-primary-700 dark:text-primary-400' : 'text-surface-900 dark:text-surface-50'}`}>
                      {activity.name}
                    </h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[activity.category] || 'bg-surface-100 text-surface-600'}`}>
                      {activity.category}
                    </span>
                  </div>
                  <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">{activity.description}</p>
                  <p className="text-[10px] text-surface-400 mt-1.5">{activity.duration}</p>
                </div>
                <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                  done
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-surface-300 dark:border-surface-600'
                }`}>
                  {done && <Check size={14} className="text-white" />}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
