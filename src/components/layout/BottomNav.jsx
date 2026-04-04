import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Moon, Heart, Timer, Brain, BookOpen, UtensilsCrossed, GlassWater, Trophy, Target } from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/training', icon: Timer, label: 'Train' },
  { to: '/sleep', icon: Moon, label: 'Sleep' },
  { to: '/nutrition', icon: GlassWater, label: 'Water' },
  { to: '/meals', icon: UtensilsCrossed, label: 'Meals' },
  { to: '/recovery', icon: Heart, label: 'Recovery' },
  { to: '/mindfulness', icon: Brain, label: 'Mind' },
  { to: '/competitions', icon: Trophy, label: 'Races' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/guide', icon: BookOpen, label: 'Guide' },
]

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 z-40 overflow-x-auto">
      <div className="flex items-center h-full min-w-max px-2 gap-1">
        {links.map(({ to, icon: Icon, label }) => (
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
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
