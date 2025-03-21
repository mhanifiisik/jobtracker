import { navItems } from '@/constants/navlinks.constant'
import { useSession } from '@/utils/use-session'
import { Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import ThemeSwitcher from './theme-switcher'
import { Link, useLocation } from 'react-router'

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const { session } = useSession()
  const location = useLocation()

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <aside
      className={`flex h-screen flex-col border-r border-gray-200 bg-white transition-[width] duration-300 dark:border-gray-700 dark:bg-gray-800 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
            <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="dark:text-white">JobTracker</span>
          </Link>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          className={`rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 ${
            collapsed ? 'ml-auto' : ''
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 p-3">
        <nav className="flex flex-col items-start justify-center gap-5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return collapsed ? (
              <Link
                to={item.path}
                className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent/20 hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.label}</span>
              </Link>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-accent/20 hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-3 dark:border-gray-700">
        {!collapsed ? (
          <div className="flex items-center justify-center gap-2">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <img
                src={session?.user.user_metadata.picture as string}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {session?.user.email}
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        ) : (
          <div className="flex flex-col-reverse items-center justify-center gap-3">
            <div className="group relative">
              <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <img
                  src={session?.user.user_metadata.picture as string}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="group relative">
              <ThemeSwitcher />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
export default Sidebar
