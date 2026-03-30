import { Moon, Sun, Coffee, Smartphone, Thermometer, Clock, Zap, BedDouble } from 'lucide-react'
import Card from '../ui/Card'

const bedtimeTips = [
  {
    icon: Clock,
    title: 'Stick to a schedule',
    text: 'Go to bed and wake up at the same time every day — even on rest days. Your body recovers best with a consistent circadian rhythm.',
  },
  {
    icon: Smartphone,
    title: 'Screen curfew',
    text: 'Stop using phones, tablets, and laptops 60 minutes before bed. Blue light suppresses melatonin and delays sleep onset.',
  },
  {
    icon: Thermometer,
    title: 'Cool your room',
    text: 'Keep your bedroom between 16-19°C (60-67°F). Your core temperature needs to drop to initiate deep sleep — a cool room helps.',
  },
  {
    icon: Coffee,
    title: 'Cut caffeine by 2pm',
    text: 'Caffeine has a half-life of 5-6 hours. An afternoon coffee can still be in your system at midnight, reducing deep sleep by up to 20%.',
  },
  {
    icon: Moon,
    title: 'Wind-down routine',
    text: 'Spend the last 30 min doing something calming — stretching, reading, or breathing exercises. This signals your body to shift into recovery mode.',
  },
  {
    icon: Sun,
    title: 'Morning sunlight',
    text: 'Get 10-15 min of natural sunlight within an hour of waking. This sets your circadian clock and makes it easier to fall asleep that night.',
  },
  {
    icon: BedDouble,
    title: 'Post-training sleep',
    text: 'After hard sessions (RPE 7+), aim for 8-9 hours. Growth hormone release peaks during deep sleep — this is when your muscles actually rebuild.',
  },
]

const napTips = [
  {
    icon: Clock,
    title: 'Keep it 20-30 minutes',
    text: 'A short "power nap" boosts alertness and performance without entering deep sleep. Waking from deep sleep causes grogginess.',
  },
  {
    icon: Zap,
    title: 'The coffee nap trick',
    text: 'Drink a coffee then immediately nap for 20 min. Caffeine kicks in as you wake, giving you a double boost. Great before an afternoon session.',
  },
  {
    icon: Sun,
    title: 'Nap before 3pm',
    text: 'Napping after 3pm can interfere with your nighttime sleep. Early afternoon (1-2pm) is the ideal window — your body naturally dips then.',
  },
  {
    icon: BedDouble,
    title: '90-minute recovery nap',
    text: 'If you need more recovery (heavy training week or poor sleep), a 90-min nap covers a full sleep cycle including deep sleep and REM.',
  },
  {
    icon: Moon,
    title: 'Race week naps',
    text: 'In the days before a race, naps can bank extra recovery if you\'re anxious and sleeping poorly at night. Don\'t stress about pre-race insomnia — naps compensate.',
  },
]

export default function SleepTips() {
  return (
    <div className="space-y-6">
      <Card title="Bedtime Tips for Recovery" subtitle="Optimise your sleep to recover faster">
        <div className="space-y-4">
          {bedtimeTips.map((tip) => (
            <div key={tip.title} className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-accent-500/10 shrink-0">
                <tip.icon size={16} className="text-accent-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-50">{tip.title}</h4>
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-0.5">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Nap Strategy for Runners" subtitle="Use naps to boost recovery between sessions">
        <div className="space-y-4">
          {napTips.map((tip) => (
            <div key={tip.title} className="flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-primary-500/10 shrink-0">
                <tip.icon size={16} className="text-primary-500" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-surface-900 dark:text-surface-50">{tip.title}</h4>
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-0.5">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
