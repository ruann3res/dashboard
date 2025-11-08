import { BrowserRouter, useLocation } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import { SidebarProvider } from './contexts/SidebarContext'
import { ToastContainer } from './components/ui/Toast/ToastContainer'
import { Sidebar } from './components/app/Sidebar'
import { AppRoutes } from '@/routes/routes'
import { useSidebar } from './contexts/SidebarContext'

function AppContent() {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar()
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/verify'

  if (isAuthPage) {
    return (
      <>
        <AppRoutes />
        <ToastContainer />
      </>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden flex items-center justify-between p-4 bg-base-100 border-b border-base-300">
          <button
            onClick={toggleMobileSidebar}
            className="btn btn-ghost btn-square"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-primary">UAIPY</h2>
          <div className="w-10" />
        </div>
        
        <main className="flex-1 overflow-auto bg-base-100">
          <AppRoutes />
        </main>
        <ToastContainer />
      </div>
    </div>
  )
}

export function App() {
  return (
    <ToastProvider>
      <SidebarProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SidebarProvider>
    </ToastProvider>
  )
}

export default App
