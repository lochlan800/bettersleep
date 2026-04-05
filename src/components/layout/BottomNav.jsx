import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Moon, Heart, Timer, Brain, BookOpen, UtensilsCrossed, GlassWater, Trophy, Target } from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Home', color: 'text-primary-500' },
  { to: '/training', icon: Timer, label: 'Train', color: 'text-red-500' },
  { to: '/sleep', icon: Moon, label: 'Sleep', color: 'text-indigo-500' },
  { to: '/nutrition', icon: GlassWater, label: 'Water', color: 'text-blue-500' },
  { to: '/meals', icon: UtensilsCrossed, label: 'Meals', color: 'text-orange-500' },
  { to: '/recovery', icon: Heart, label: 'Recovery', color: 'text-rose-500' },
  { to: '/mindfulness', icon: Brain, label: 'Mind', color: 'text-purple-500' },
  { to: '/competitions', icon: Trophy, label: 'Races', color: 'text-amber-500' },
  { to: '/goals', icon: Target, label: 'Goals', color: 'text-emerald-500' },
  { to: '/guide', icon: BookOpen, label: 'Guide', color: 'text-cyan-500' },
]

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 z-40 overflow-x-auto">
      <div className="flex items-center h-full min-w-max px-2 gap-1">
        {links.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-surface-500 dark:text-surface-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} className={color} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
