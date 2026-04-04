import { useState } from 'react';
import { Moon, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getToday } from '../../utils/dateHelpers';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { vibrate } from '../../utils/vibrate';
import { playSound } from '../../utils/playSound';
import { useCelebration } from '../../context/CelebrationContext';

const DEFAULT_FORM = {
  date: getToday(),
  bedtime: '22:00',
  wakeTime: '06:00',
  qualityRating: 3,
  notes: '',
};

export default function SleepLogForm({ onSuccess } = {}) {
  const { addSleepLog } = useApp();
  const { triggerCelebration } = useCelebration();
  const [form, setForm] = useState(DEFAULT_FORM);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addSleepLog({
      date: form.date,
      bedtime: form.bedtime,
      wakeTime: form.wakeTime,
      qualityRating: form.qualityRating,
      notes: form.notes.trim() || undefined,
    });
    vibrate('success');
    playSound('explosion');
    triggerCelebration();
    setForm({ ...DEFAULT_FORM, date: getToday() });
    onSuccess?.();
  };

  return (
    <Card title="Log Sleep" subtitle="Record last night's sleep">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            max={getToday()}
            required
            className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Bedtime & Wake time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Bedtime
            </label>
            <input
              type="time"
              value={form.bedtime}
              onChange={(e) => update('bedtime', e.target.value)}
              required
              className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Wake time
            </label>
            <input
              type="time"
              value={form.wakeTime}
              onChange={(e) => update('wakeTime', e.target.value)}
              required
              className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Quality rating */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Sleep quality
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => update('qualityRating', n)}
                className="p-1 transition-colors focus:outline-none"
                aria-label={`Rate ${n} out of 5`}
              >
                <Star
                  size={28}
                  className={
                    n <= form.qualityRating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-surface-300 dark:text-surface-600'
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Notes (optional)
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows={2}
            placeholder="e.g. woke up once, had caffeine late..."
            className="w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-50 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <Button type="submit" className="w-full">
          <Moon size={16} />
          Save Sleep Log
        </Button>
      </form>
    </Card>
  );
}
