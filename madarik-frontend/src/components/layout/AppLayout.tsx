import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useUIStore } from '@/stores/uiStore'

export default function AppLayout() {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="flex h-screen bg-[hsl(var(--background))] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className="flex flex-col flex-1 overflow-hidden transition-all duration-300"
        style={{
          marginInlineStart: sidebarCollapsed ? '72px' : '260px',
        }}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-6 fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
