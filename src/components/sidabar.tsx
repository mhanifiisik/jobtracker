import { useState } from 'react'

import { Link, useLocation } from 'react-router'
import ThemeSwitcher from './theme-switcher'
import { useSession } from '../utils/use-session'
import { ChevronLeft, ChevronRight, Briefcase } from 'lucide-react'
import { navItems } from '../constants/navlinks.constant'
import NavLink from './navlink'

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const location = useLocation()
  const { session } = useSession()

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
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return <NavLink key={item.path} item={item} collapsed={collapsed} active={isActive} />
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
