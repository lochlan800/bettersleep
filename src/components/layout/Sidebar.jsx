import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Moon, Heart, Timer, Brain, BookOpen, UtensilsCrossed, GlassWater, Trophy, Target } from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', color: 'text-primary-500' },
  { to: '/training', icon: Timer, label: 'Training', color: 'text-red-500' },
  { to: '/sleep', icon: Moon, label: 'Sleep', color: 'text-indigo-500' },
  { to: '/nutrition', icon: GlassWater, label: 'Water', color: 'text-blue-500' },
  { to: '/meals', icon: UtensilsCrossed, label: 'Meals', color: 'text-orange-500' },
  { to: '/recovery', icon: Heart, label: 'Recovery', color: 'text-rose-500' },
  { to: '/mindfulness', icon: Brain, label: 'Mindfulness', color: 'text-purple-500' },
  { to: '/competitions', icon: Trophy, label: 'Competitions', color: 'text-amber-500' },
  { to: '/goals', icon: Target, label: 'Goals', color: 'text-emerald-500' },
  { to: '/guide', icon: BookOpen, label: 'Guide', color: 'text-cyan-500' },
]

export default function Sidebar() {
  return (
    <nav className="hidden lg:flex flex-col w-60 border-r border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-4 gap-1">
      {links.map(({ to, icon: Icon, label, color }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={20} className={isActive ? color : ''} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
