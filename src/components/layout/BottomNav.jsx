import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Moon, Utensils, Heart, Timer, BookOpen } from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/training', icon: Timer, label: 'Train' },
  { to: '/sleep', icon: Moon, label: 'Sleep' },
  { to: '/nutrition', icon: Utensils, label: 'Water' },
  { to: '/recovery', icon: Heart, label: 'Recovery' },
  { to: '/guide', icon: BookOpen, label: 'Guide' },
]

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 flex items-center justify-around z-40">
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-2 py-1 text-xs font-medium transition-colors ${
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
    </nav>
  )
}
