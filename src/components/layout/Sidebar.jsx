import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Moon, Utensils, Heart, Timer, BookOpen } from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/training', icon: Timer, label: 'Training' },
  { to: '/sleep', icon: Moon, label: 'Sleep' },
  { to: '/nutrition', icon: Utensils, label: 'Water' },
  { to: '/recovery', icon: Heart, label: 'Recovery' },
  { to: '/guide', icon: BookOpen, label: 'Guide' },
]

export default function Sidebar() {
  return (
    <nav className="hidden lg:flex flex-col w-60 border-r border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 p-4 gap-1">
      {links.map(({ to, icon: Icon, label }) => (
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
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
