import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useSidebar } from '@/contexts/SidebarContext'
import { useLogout } from '@/hooks/use-logout'
import { menuItems } from './menu'
import type { MenuItem } from './menu'

export const Sidebar = () => {
  const location = useLocation()
  const { isCollapsed, isMobileOpen, toggleSidebar } = useSidebar()
  const { logout } = useLogout()

  return (
    <aside 
      className={`bg-base-200 flex flex-col transition-all duration-300 border-r border-base-300 fixed lg:relative lg:translate-x-0 z-50 lg:z-auto h-full ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <h2 className={`text-xl font-bold text-primary transition-all whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
          UAIPY
        </h2>
        <button
          onClick={toggleSidebar}
          className="btn btn-ghost btn-sm btn-square hidden lg:flex"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item: MenuItem) => {
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all whitespace-nowrap ${
                    isCollapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-base-300'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={`transition-all ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-base-300 space-y-3">
        <div className={`flex items-center justify-between ${isCollapsed ? 'hidden' : ''}`}>
          <span className="text-sm text-base-content/70">Tema</span>
          <ThemeToggle />
        </div>
        <button
          onClick={logout}
          className={`btn btn-error btn-block ${isCollapsed ? 'btn-square' : ''}`}
          title={isCollapsed ? 'Sair' : undefined}
        >
          {isCollapsed ? '🚪' : 'Sair'}
        </button>
      </div>
    </aside>
  )
}
