import { NavLink, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'
import {
  LayoutDashboard, Users, FolderKanban, CheckSquare, FileText,
  FileSignature, Receipt, TrendingDown, TrendingUp, ClipboardList, Users2,
  Package, CalendarDays, Headphones, BookOpen, RefreshCw,
  Target, HardDrive, BarChart3, DollarSign, Settings,
  ChevronLeft, ChevronRight, LogOut, Bell, Bot, Handshake,
  Calendar, ClockIcon
} from 'lucide-react'

const navItems = [
  { label: 'لوحة التحكم', labelEn: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', permission: null },
  { divider: 'المبيعات والعملاء' },
  { label: 'إدارة العملاء المحتملين', labelEn: 'CRM', icon: Users, path: '/crm', permission: 'leads.view' },
  { label: 'العملاء', labelEn: 'Clients', icon: Handshake, path: '/clients', permission: 'clients.view' },
  { label: 'المنتجات والخدمات', labelEn: 'Products', icon: Package, path: '/products', permission: 'products.view' },
  { divider: 'إدارة المشاريع' },
  { label: 'المشاريع', labelEn: 'Projects', icon: FolderKanban, path: '/projects', permission: 'projects.view' },
  { label: 'المهام', labelEn: 'Tasks', icon: CheckSquare, path: '/tasks', permission: 'tasks.view' },
  { label: 'التقارير الأسبوعية', labelEn: 'Weekly Reports', icon: ClipboardList, path: '/daily-reports', permission: 'reports.view' },
  { label: 'الاجتماعات', labelEn: 'Meetings', icon: Users2, path: '/meetings', permission: 'meetings.view' },
  { divider: 'المالية' },
  { label: 'عروض الأسعار', labelEn: 'Quotations', icon: FileText, path: '/quotations', permission: 'quotations.view' },
  { label: 'العقود', labelEn: 'Contracts', icon: FileSignature, path: '/contracts', permission: 'contracts.view' },
  { label: 'الفواتير', labelEn: 'Invoices', icon: Receipt, path: '/invoices', permission: 'invoices.view' },
  { label: 'الإيرادات المستقلة', labelEn: 'Incomes', icon: TrendingUp, path: '/incomes', permission: 'invoices.view' },
  { label: 'المصروفات', labelEn: 'Expenses', icon: TrendingDown, path: '/expenses', permission: 'expenses.view' },
  { divider: 'التحليلات' },
  { label: 'الأرباح والخسائر', labelEn: 'P&L', icon: BarChart3, path: '/analytics/profit-loss', permission: 'analytics.view' },
  { label: 'التدفق النقدي', labelEn: 'Cash Flow', icon: DollarSign, path: '/analytics/cash-flow', permission: 'analytics.view' },
  { label: 'الأهداف', labelEn: 'Goals', icon: Target, path: '/goals', permission: 'goals.view' },
  { divider: 'النظام' },
  { label: 'التجديدات', labelEn: 'Renewals', icon: RefreshCw, path: '/renewals', permission: 'renewals.view' },
  { label: 'الأصول', labelEn: 'Assets', icon: HardDrive, path: '/assets', permission: 'assets.view' },
  { label: 'الدعم الفني', labelEn: 'Support', icon: Headphones, path: '/support', permission: 'support.view' },
  { label: 'قاعدة المعرفة', labelEn: 'Knowledge', icon: BookOpen, path: '/knowledge', permission: 'knowledge.view' },
  { label: 'التقويم', labelEn: 'Calendar', icon: CalendarDays, path: '/calendar', permission: 'calendar.view' },
  { label: 'الفريق', labelEn: 'Team', icon: Users, path: '/team', permission: 'team.view' },
  { label: 'الإشعارات', labelEn: 'Notifications', icon: Bell, path: '/notifications', permission: 'notifications.view' },
  { label: 'الإعدادات', labelEn: 'Settings', icon: Settings, path: '/settings', permission: 'settings.view' },
]

export default function Sidebar() {
  const { sidebarCollapsed, collapseSidebar, locale } = useUIStore()
  const { user, logout, hasPermission } = useAuthStore()
  const navigate = useNavigate()

  const { data: settings = {} } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour to prevent constant refetching
  })

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch {}
    logout()
    navigate('/login')
  }

  return (
    <aside
      className="fixed top-0 bottom-0 inset-inline-start-0 z-40 flex flex-col sidebar transition-all duration-300"
      style={{ width: sidebarCollapsed ? '72px' : '260px' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3">
            {(settings.logo_path || settings.logo) ? (
              <img src={(settings.logo_path || settings.logo).startsWith('http') ? (settings.logo_path || settings.logo) : ('http://localhost:8000/' + ((settings.logo_path || settings.logo).replace(/^\//, '').startsWith('storage') ? '' : 'storage/') + (settings.logo_path || settings.logo).replace(/^\//, ''))} alt="Logo" className="w-10 h-10 object-contain rounded bg-white p-1 shadow-lg" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {settings.company_name_ar ? settings.company_name_ar.charAt(0) : 'م'}
              </div>
            )}
            <div>
              <div className="text-white font-bold text-sm leading-tight max-w-[140px] truncate" title={settings.company_name_ar || 'مدارك تك'}>
                {settings.company_name_ar || 'مدارك تك'}
              </div>
              <div className="text-white/50 text-xs max-w-[140px] truncate" title={settings.company_name_en || 'Business OS'}>
                {settings.company_name_en || 'Business OS'}
              </div>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          (settings.logo_path || settings.logo) ? (
            <img src={(settings.logo_path || settings.logo).startsWith('http') ? (settings.logo_path || settings.logo) : ('http://localhost:8000/' + ((settings.logo_path || settings.logo).replace(/^\//, '').startsWith('storage') ? '' : 'storage/') + (settings.logo_path || settings.logo).replace(/^\//, ''))} alt="Logo" className="w-10 h-10 mx-auto object-contain rounded bg-white p-1" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg mx-auto">
              {settings.company_name_ar ? settings.company_name_ar.charAt(0) : 'م'}
            </div>
          )
        )}
        <button
          onClick={collapseSidebar}
          className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 flex-shrink-0"
          style={{ marginInlineStart: sidebarCollapsed ? '0' : 'auto' }}
        >
          {sidebarCollapsed
            ? <ChevronRight size={16} />
            : <ChevronLeft size={16} />
          }
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item, i) => {
          if ('divider' in item) {
            if (sidebarCollapsed) return <div key={i} className="my-2 border-t border-white/10" />
            return (
              <div key={i} className="px-3 pt-4 pb-1 text-xs font-semibold text-white/30 uppercase tracking-wider">
                {item.divider}
              </div>
            )
          }

          // Check permission
          if (item.permission && !hasPermission(item.permission)) return null

          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={sidebarCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
                ${isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-white/65 hover:text-white hover:bg-white/10'
                }
                ${sidebarCollapsed ? 'justify-center' : ''}
                `
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-white/10 p-3">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {user?.name?.charAt(0) ?? 'م'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{user?.name ?? 'المستخدم'}</div>
              <div className="text-white/40 text-xs truncate">{user?.position ?? user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/10"
              title="تسجيل الخروج"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center text-white/40 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/10"
            title="تسجيل الخروج"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  )
}
