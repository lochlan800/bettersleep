import { Moon, Sun, Activity } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Header() {
  const { settings, updateSettings } = useApp()

  return (
    <header className="h-16 border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Activity className="text-primary-600" size={24} />
        <h1 className="text-xl font-bold text-surface-900 dark:text-surface-50">BetterSleep</h1>
      </div>
      <button
        onClick={() => updateSettings({ darkMode: !settings.darkMode })}
        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400 transition-colors"
      >
        {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  )
}
