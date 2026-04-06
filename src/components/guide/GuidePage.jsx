import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronRight, Download, Upload } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Card from '../ui/Card'

const sections = [
  {
    title: 'What is MyRunningDiary?',
    content: `MyRunningDiary is a training recovery tool built for runners. It tracks your runs, sleep, water, meals, mindfulness, stretching, goals, and competitions, then combines them into a single Recovery Score that tells you how ready your body is to train again.

The goal is simple: train smarter, recover better, and reduce your injury risk. Instead of guessing whether you should push hard or take it easy, the app gives you a data-driven answer.

**You can install it as an app on your phone** — tap the browser menu and select "Add to Home Screen". Share the link with friends and they'll get their own fresh copy with no data.`,
  },
  {
    title: 'How to Use It',
    content: `**Daily routine (takes about 2 minutes):**

• **Morning** — Go to Sleep tab, log last night's bedtime, wake time, and rate your sleep quality (1-5 stars).

• **After a run** — Go to Training tab, log your session: type, distance, duration, RPE (how hard it felt on the CR10 scale), and soreness level.

• **Throughout the day** — Go to Water tab and tap the quick-add buttons each time you drink water.

• **Check Dashboard** — Your Recovery Score updates automatically. The colourful progress rings show each component at a glance, and the recommendations give you personalised advice.

• **Recovery tab** — Use the stretching routines and tick them off as you go. This boosts your recovery score.

• **Mindfulness tab** — Do at least one mindfulness activity daily — bilateral tapping, dark bath, journaling, whatever helps. This counts toward your recovery score too.

• **Meals tab** — Check your weekly meal plan and tap "I ate this" on today's meals to track what you've eaten. This counts toward your recovery score.

• **Goals tab** — Set SMART goals and check in daily. Tap "Did it today?" each day you work toward your goal.

• **Competitions tab** — After a race, log your result and rate your performance across 7 areas to track your progress over time.`,
  },
  {
    title: 'Recovery Score (0-100)',
    content: `This is your main number. It combines everything into one score telling you how ready you are to train.

**How it's calculated:**
The weights adjust based on how much data you have:

• **With enough training history (4+ sessions):**
  Sleep = 25% | Freshness (ACWR) = 15% | Soreness = 20% | Hydration = 10% | Mindfulness = 10% | Stretching = 10% | Nutrition = 5% | Goals = 5%

• **Without enough training history:**
  Sleep = 25% | Soreness = 30% | Hydration = 10% | Mindfulness = 10% | Stretching = 10% | Nutrition = 5% | Goals = 10% | Freshness = 0%

ACWR is excluded when there isn't enough data to make it meaningful. Everything else always counts — even on your first day.

**The Dashboard Progress Rings:**
When you open the dashboard, 8 colourful rings pop up in a wave showing each component: Sleep (indigo), Freshness (teal), Soreness (orange), Hydration (blue), Mindfulness (purple), Stretching (pink), Nutrition (yellow), and Goals (emerald). Each ring fills based on how well you're doing in that area.

**What the scores mean:**
• **80-100 (Excellent)** — You're fully recovered. Go hard — intervals, tempo, sprints. You'll also see confetti rain to celebrate!
• **60-79 (Good)** — Normal training, stick to your plan.
• **40-59 (Fair)** — Take it easy. Easy long run or active recovery only.
• **0-39 (Poor)** — Rest day. Focus on sleep, hydration, and stretching.`,
  },
  {
    title: 'Sleep Score (0-100)',
    content: `Your sleep score is made up of three parts added together:

**Duration (0-40 points):**
• 7-9 hours = 40 points (optimal for recovery)
• Over 9 hours = 30 points
• 6-7 hours = 25 points
• 5-6 hours = 15 points
• Under 5 hours = 0 points

**Quality (0-35 points):**
Your star rating out of 5, scaled to 35. So 5 stars = 35, 4 stars = 28, 3 stars = 21.

**Consistency (0-25 points):**
How consistent your bedtime has been over the last 7 nights. Going to bed within 15 minutes of the same time every night = full 25 points. Varying by more than 90 minutes = 0 points.

**Why consistency matters:** Irregular sleep disrupts your circadian rhythm, which reduces the quality of deep sleep — the phase where growth hormone is released and muscles repair.`,
  },
  {
    title: 'Training Load & ACWR',
    content: `**Training Load** is calculated for each session:
Training Load = Duration (minutes) × RPE (CR10 scale 0-10)

Example: A 50-minute run at RPE 7 = load of 350.

**Acute Load** = Total training load from the last 7 days (recent stress).

**Chronic Load** = Average weekly load over the last 28 days (what your body is used to).

**ACWR (Acute:Chronic Workload Ratio)** = Acute ÷ Chronic

This tells you whether you're training more or less than your body is adapted to:

• **0.8-1.3 (Green — Safe Zone)** — Training is within your body's capacity. This is the sweet spot for progress without injury.
• **1.3-1.5 (Yellow — Caution)** — You've ramped up more than usual. Injury risk is rising. Be careful.
• **Over 1.5 (Red — Danger)** — You've spiked your training well above normal. High injury risk. Back off.
• **Under 0.8** — You're doing less than usual. Fitness may be declining (detraining).

**Key insight:** The ACWR isn't about how much you train — it's about how quickly you change. A gradual build from 30km/week to 50km/week is safe. Jumping from 30 to 50 in one week is dangerous, even though 50km/week isn't that much.`,
  },
  {
    title: 'The CR10 RPE Scale',
    content: `The Foster Modified CR10 (Category Ratio 10) scale measures how hard a session felt overall. It was developed by Gunnar Borg and adapted by Carl Foster specifically for monitoring athlete training load.

**How to use it:** Rate your session about 30 minutes after finishing. Think about the WHOLE session, not just the hardest part.

• **0 — Rest:** No exertion at all
• **1 — Very Easy:** Barely noticeable effort
• **2 — Easy:** Comfortable, full conversation possible
• **3 — Moderate:** Steady effort, can speak in sentences
• **4 — Somewhat Hard:** Breathing harder, conversation becomes choppy
• **5 — Hard:** Challenging, only a few words at a time
• **6 — Very Hard:** Vigorous, short phrases only
• **7 — Very Hard+:** Very vigorous, difficult to speak
• **8 — Extremely Hard:** Pushing your limits
• **9 — Near Max:** Almost all-out, can barely continue
• **10 — Maximal:** Absolute maximum, cannot continue

**Why RPE over heart rate?** RPE captures everything — physical effort, mental fatigue, heat, hills, how you slept. Heart rate misses most of these factors.`,
  },
  {
    title: 'Freshness Score',
    content: `The Freshness score on the dashboard shows how recovered you are from training:

**Freshness = 100 - Fatigue Score**

• **90-100** — Fully fresh, no accumulated fatigue. Ready for anything.
• **70-89** — Well rested. Good to train normally.
• **50-69** — Some fatigue building up. Monitor how you feel.
• **30-49** — Significant fatigue. Consider an easy day or rest.
• **0-29** — Very fatigued. Rest strongly recommended.

If you have fewer than 4 training sessions logged or haven't built up enough chronic load yet, freshness will show 100. Once you have about 4 weeks of consistent data, the score becomes meaningful.`,
  },
  {
    title: 'Hydration',
    content: `The water tracker has a fixed target of 2,000ml per day.

**Quick-add buttons** let you log 250ml, 500ml, or 750ml with one tap. You can also enter a custom amount.

**Reset** clears today's entries if you make a mistake.

**Why it matters for recovery:** Even mild dehydration (2% body weight loss) reduces performance and slows recovery. Water is essential for nutrient transport to muscles, waste removal, and temperature regulation.

**Tips:**
• Drink consistently throughout the day rather than all at once
• Have a glass of water first thing in the morning
• Drink extra after training — roughly 500ml per hour of exercise
• If your urine is dark yellow, you're behind on hydration`,
  },
  {
    title: 'Soreness Level (1-5)',
    content: `You log soreness after each training session. This feeds directly into your Recovery Score (20% weight).

• **1 — No soreness:** Muscles feel normal.
• **2 — Mild:** Slightly aware of muscles but no discomfort.
• **3 — Moderate:** Noticeable discomfort, especially going up/down stairs.
• **4 — High:** Significant muscle pain, affects movement.
• **5 — Severe:** Very painful, difficult to move normally.

**What to do at each level:**
• 1-2: Normal training. Light stretching is sufficient.
• 3: Include foam rolling and stretching. Consider an easy day.
• 4: Ice affected areas. Easy movement only.
• 5: Full rest. Ice every 2-3 hours. See a physio if it persists.

Soreness peaking 24-48 hours after training (DOMS) is normal. Soreness that doesn't improve after 72 hours may indicate overtraining or injury.`,
  },
  {
    title: 'Rest Day Planner',
    content: `The rest day planner on the Recovery tab shows your last 7 days — which days you trained and which you rested.

**It warns you if:**
• You've trained 3 or more consecutive days — schedule a rest day soon.
• Your ACWR is above 1.5 — training load is too high, take a rest or easy day.

**Rest days aren't lazy days.** They're when adaptation happens. Your muscles don't get stronger during training — they get stronger during recovery. Without adequate rest, you accumulate fatigue, performance drops, and injury risk increases.

**General guideline:** Most runners benefit from 1-2 rest days per week, depending on training volume and intensity.`,
  },
  {
    title: 'Training Breakdown Charts',
    content: `The two pie charts on the Training tab show how your training is distributed:

**Time Breakdown** — What percentage of your total training time is spent on each session type. This helps you see if you're balancing easy and hard sessions.

**Session Breakdown** — How many sessions of each type as a percentage. This shows variety in your training.

**The 80/20 rule:** Most coaches recommend roughly 80% of training at easy/moderate intensity and 20% at high intensity. If your charts show the opposite, you might be going too hard too often.`,
  },
  {
    title: 'Stretching & Foam Rolling',
    content: `The Recovery tab shows stretching routines targeted to your most recent training type. Each stretch has a checkbox — tick it off when you've done it.

**Stretching contributes to your recovery score.** The more stretches you complete, the higher your score. You can see your progress (e.g. "4/10 done") at the top of the stretching section.

**Stretching:** Best done after training or in the evening. Hold each stretch for 30-60 seconds. Never bounce. The app shows stretches covering calves, hamstrings, quads, hip flexors, IT band, glutes, piriformis, achilles, plantar fascia, and lower back.

**Foam rolling:** Apply moderate pressure and roll slowly (about 1 inch per second). When you find a tender spot, hold for 20-30 seconds.

**When to foam roll vs stretch:**
• Before a run: foam roll only (dynamic warm-up)
• After a run: foam roll first, then stretch
• Rest days: both, focusing on tight areas`,
  },
  {
    title: 'Mindfulness',
    content: `The Mindfulness tab helps you recover your mind as well as your body. It shows 12 activities across different categories — tick off the ones you've done today.

**Your 4 core activities:**
• **Bilateral Tapping** — Close your eyes, put on bilateral music, gently tap yourself, and breathe slowly in and out. Great for calming the nervous system.
• **Dark Bath** — Have a bath in a dark room with candles and bilateral music. Deeply relaxing for both body and mind.
• **Terrarium Building** — A creative, meditative activity that focuses your attention and calms racing thoughts.
• **Mindful Running** — An easy run where you focus on breathing, foot contact, and surroundings instead of pace or performance.

**Additional activities:** Box breathing, body scan meditation, journaling, cold exposure, nature sitting, stretching with breathwork, music listening, and gratitude practice.

**How it affects recovery:**
Mindfulness contributes 10% to your recovery score.
• 1 activity = 60% of the mindfulness points
• 2 activities = 80%
• 3 or more = 100%

Even 5 minutes of one activity makes a difference. The dashboard will nudge you if you haven't done any.`,
  },
  {
    title: 'Meal Planner',
    content: `The Meals tab generates a weekly meal plan optimised for runners. All meals use whole, unprocessed ingredients — no preservatives, no emulsifiers.

**What it includes:**
• 7 breakfast options (porridge, toast, smoothie bowls, overnight oats, pancakes)
• 7 morning snack options (fruit & nuts, hummus, energy bites, trail mix)
• 7 afternoon snack options (yoghurt pots, smoothies, energy bars)

**"I ate this" tracking:**
On today's tab (highlighted in teal), each meal has an "I ate this" button. Tap it to mark that you've eaten that meal. This counts toward your recovery score — eating more of your planned meals gives you more nutrition points.

**Nutritional focus:**
• **Iron-rich meals** — Runners need 18mg of iron per day. Each meal shows its iron content and you can track your daily total with the iron progress bar.
• **Macro balance** — Carb-focused for sustained energy, with balanced protein and fats. The macro bar chart shows your daily percentages.
• **7-a-day tracker** — Counts your unique fruit and veg portions from breakfast and snacks.

**Features:**
• **Generate** creates a new randomised weekly plan with no meal repeats
• **Shuffle** regenerates a single day while keeping the rest of the week
• **Shopping list** aggregates all ingredients across the week by category, with checkboxes to tick off what you've bought`,
  },
  {
    title: 'Competitions',
    content: `The Competitions tab lets you log race results and reflect on your performance.

**Events:** 50m, 100m, 200m, 400m, 800m, 1500m, and Park Run (5K).

**What you log:**
• Date, event type, and competition name
• Your finishing time (minutes and seconds)
• Placement (1st, 2nd, 3rd, top 10, top 25%, top 50%, finished, or DNF)
• Whether it was a Personal Best (PB)

**Self-assessment — 7 reflection questions (rated 1-5):**
• Overall performance
• Pacing throughout the race
• Start/reaction
• Mental game
• How your body felt
• Running form and technique
• How well your training prepared you

**Why reflect?** Rating yourself honestly after each race helps you spot patterns. Maybe your starts are always weak, or your pacing falls apart in the second half. Over time, these ratings show you exactly what to work on in training.

**Personal Bests:** Tick the PB checkbox when you set a new personal best — you'll get a confetti rain celebration!

You can also add free-text notes for anything else — what went well, what to improve, how conditions affected you. Every logged competition can be edited or deleted.`,
  },
  {
    title: 'SMART Goals',
    content: `The Goals tab lets you set structured goals using the SMART framework. A step-by-step wizard walks you through each part:

**S — Specific:** What exactly do you want to achieve?
**M — Measurable:** How will you track progress?
**A — Achievable:** Is this realistic for you right now?
**R — Relevant:** Why does this matter to you?
**T — Time-bound:** When will you achieve this by?

**Categories:**
• **Recovery** — Sleep, stretching, mindfulness goals
• **Training** — Distance, frequency, consistency goals
• **Performance** — Race times, PBs, competition goals

**Daily check-ins:**
Each active goal has a "Did it today?" button. Tap it each day you work toward your goal. You can see your last 7 days in a grid and your total days checked in.

**Templates:** Not sure where to start? Pick from pre-made templates like "Sleep consistency", "Weekly distance", or "Park Run PB" — they fill in the Specific, Measurable, and Achievable fields for you.

**Goals contribute to your recovery score** — the more active goals you check in on today, the higher your goals percentage. This makes up 5-10% of your total recovery score.`,
  },
  {
    title: 'Celebrations & Confetti',
    content: `MyRunningDiary celebrates your achievements with animations and sound effects to keep you motivated!

**Celebration animation (star → explosion → thumbs up):**
When you tick something off — a stretch, a meal, a mindfulness activity, a goal check-in — you'll see a small celebration animation in the bottom-right corner with a star swirl, sparkle explosion, and thumbs up.

This only happens when you tick something ON, not when you untick it.

**Confetti rain:**
Colourful confetti rains down the screen when:
• Your recovery score hits 80 or above (Excellent)
• You log a competition marked as a Personal Best (PB)

**Sound effects:**
• **Twinkle** — plays when you tick off individual items (stretches, meals, mindfulness, goal check-ins)
• **Explosion** — plays when you save something big (a training log, sleep log, competition, or new goal)

**Splash screen:**
When you open the app, a runner emoji swooshes in with the app name, then transitions to the dashboard with an explosion sound and celebration animation.`,
  },
  {
    title: 'Installing as an App',
    content: `MyRunningDiary is a Progressive Web App (PWA) — you can install it on your phone's home screen so it looks and feels like a real app.

**How to install:**
• **Android Chrome** — Tap the three-dot menu (⋮) → "Add to Home Screen" → "Install"
• **iPhone Safari** — Tap the share button (□↑) → "Add to Home Screen"

Once installed, it opens full-screen without the browser bar and has its own icon on your home screen.

**Sharing with friends:**
Just send them the website link. Each person's data is stored privately on their own device — nobody can see anyone else's logs. When you update the app, everyone gets the latest version automatically.`,
  },
  {
    title: 'Dashboard Recommendations',
    content: `The "Today's Recommendations" section on the Dashboard gives you personalised advice that changes every day based on your actual data.

**What drives the recommendations:**
• **Sleep** — Warns if you slept too little or too much last night, flags inconsistent bedtimes, suggests extra sleep after hard sessions.
• **Water** — Shows your exact progress toward 2,000ml with how much you have left to drink.
• **Training load** — Warns about consecutive training days, ACWR approaching danger zones, and suggests when to back off or when you can push.
• **Soreness** — Gives specific recovery advice based on your logged soreness level (stretching, foam rolling, ice, rest).
• **Mindfulness** — Nudges you if you haven't done any today, congratulates you when you've done 3+.
• **Stretching** — Reminds you to tick off stretches after training, encourages you to do more if you've only done a few.
• **Post-training nutrition** — Suggests meals based on your session intensity and how long ago you trained.

Recommendations are colour-coded by priority: **red** (high — act on this now), **yellow** (medium — worth doing), **blue** (low — nice to know).`,
  },
]

function Section({ title, content }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
      >
        <span className="font-semibold text-surface-900 dark:text-surface-50">{title}</span>
        {open ? (
          <ChevronDown size={18} className="text-primary-500 shrink-0" />
        ) : (
          <ChevronRight size={18} className="text-surface-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-surface-600 dark:text-surface-400 leading-relaxed whitespace-pre-line">
          {content.split(/(\*\*.*?\*\*)/).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="text-surface-800 dark:text-surface-200">{part.slice(2, -2)}</strong>
            }
            return <span key={i}>{part}</span>
          })}
        </div>
      )}
    </div>
  )
}

const DATA_KEYS = [
  'bs_sleep_logs',
  'bs_training_logs',
  'bs_hydration_logs',
  'bs_mindfulness_logs',
  'bs_stretching_logs',
  'bs_meal_plans',
  'bs_competition_logs',
  'bs_goals',
  'bs_soreness_logs',
  'bs_settings',
];

function DataBackup() {
  const [importStatus, setImportStatus] = useState(null)

  const handleExport = () => {
    const data = {}
    DATA_KEYS.forEach((key) => {
      const val = localStorage.getItem(key)
      if (val) data[key] = JSON.parse(val)
    })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `myrunningdiary-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        let count = 0
        DATA_KEYS.forEach((key) => {
          if (data[key] !== undefined) {
            localStorage.setItem(key, JSON.stringify(data[key]))
            count++
          }
        })
        setImportStatus({ success: true, message: `Imported ${count} data sections. Reload the page to see your data.` })
      } catch {
        setImportStatus({ success: false, message: 'Invalid file. Please select a valid MyRunningDiary backup file.' })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="p-4 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700">
      <h3 className="font-bold text-surface-900 dark:text-surface-50 mb-2">Backup & Restore</h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
        Your data is stored in this browser only. Export a backup to keep it safe, or import a previous backup to restore your data.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={18} />
          Export Backup
        </button>
        <label className="flex items-center gap-2 bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 px-4 py-2 rounded-lg transition-colors cursor-pointer">
          <Upload size={18} />
          Import Backup
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>
      </div>
      {importStatus && (
        <p className={`text-sm mt-3 ${importStatus.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {importStatus.message}
        </p>
      )}
    </div>
  )
}

export default function GuidePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-7 w-7 text-primary-600 dark:text-primary-400" />
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Guide</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            How to use MyRunningDiary and what everything means
          </p>
        </div>
      </div>

      <DataBackup />

      <div className="space-y-2">
        {sections.map((s) => (
          <Section key={s.title} title={s.title} content={s.content} />
        ))}
      </div>
    </div>
  )
}
