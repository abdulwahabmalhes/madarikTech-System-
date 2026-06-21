import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { Sun, Moon, Globe, Bell, Search, Menu, Check, Users, FolderGit2, CheckSquare, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

const pageTitles: Record<string, string> = {
  '/dashboard'           : 'لوحة التحكم',
  '/crm'                 : 'إدارة العملاء المحتملين',
  '/clients'             : 'العملاء',
  '/projects'            : 'المشاريع',
  '/tasks'               : 'المهام',
  '/quotations'          : 'عروض الأسعار',
  '/contracts'           : 'العقود',
  '/invoices'            : 'الفواتير',
  '/expenses'            : 'المصروفات',
  '/daily-reports'       : 'التقارير الأسبوعية',
  '/meetings'            : 'الاجتماعات',
  '/products'            : 'المنتجات والخدمات',
  '/renewals'            : 'التجديدات',
  '/goals'               : 'الأهداف',
  '/assets'              : 'الأصول',
  '/support'             : 'الدعم الفني',
  '/calendar'            : 'التقويم',
  '/team'                : 'الفريق',
  '/knowledge'           : 'قاعدة المعرفة',
  '/notifications'       : 'الإشعارات',
  '/settings'            : 'الإعدادات',
  '/analytics/profit-loss': 'تقرير الأرباح والخسائر',
  '/analytics/cash-flow' : 'التدفق النقدي',
}

export default function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { darkMode, toggleDarkMode, locale, setLocale, toggleSidebar } = useUIStore()
  const { user } = useAuthStore()

  const [showNotifications, setShowNotifications] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then(r => r.data),
    refetchInterval: 60000, // Auto refresh every minute
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.put(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  })

  const title = Object.entries(pageTitles).find(([path]) =>
    pathname === path || pathname.startsWith(path + '/')
  )?.[1] ?? 'الصفحة الرئيسية'

  const unreadCount = notificationsData?.unread_count || 0
  const recentNotifications = (notificationsData?.notifications?.data || []).slice(0, 5)

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[hsl(var(--surface))] border-b border-[hsl(var(--border))] flex-shrink-0">
      {/* Left: Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-[15px] font-semibold text-[hsl(var(--foreground))]">{title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="p-2 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors">
          <Search size={18} />
        </button>

        {/* Dark Mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
          title={darkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Language */}
        <button
          onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
          className="p-2 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
          title="تغيير اللغة"
        >
          <Globe size={18} />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-colors ${showNotifications ? 'bg-[hsl(var(--surface-hover))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted))] hover:bg-[hsl(var(--surface-hover))] hover:text-[hsl(var(--foreground))]'}`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 end-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full end-0 mt-2 w-80 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-xl shadow-xl z-50 overflow-hidden slide-up">
              <div className="flex items-center justify-between p-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                <span className="font-bold text-sm">الإشعارات</span>
                {unreadCount > 0 && (
                  <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full dark:bg-emerald-900/30 dark:text-emerald-400">
                    {unreadCount} جديد
                  </span>
                )}
              </div>
              
              <div className="max-h-[300px] overflow-y-auto">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notif: any) => {
                    const isUnread = !notif.read_at
                    return (
                      <div 
                        key={notif.id}
                        className={`p-3 border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--surface-hover))] transition-colors flex gap-3 ${isUnread ? 'bg-emerald-50/20 dark:bg-emerald-900/10' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUnread ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800'}`}>
                          {notif.data?.type === 'lead' ? <Users size={14} /> : 
                           notif.data?.type === 'project' ? <FolderGit2 size={14} /> : 
                           notif.data?.type === 'task' ? <CheckSquare size={14} /> : 
                           notif.data?.type === 'renewal' ? <RefreshCw size={14} /> : 
                           <Bell size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${isUnread ? 'font-bold text-[hsl(var(--foreground))]' : 'text-[hsl(var(--foreground))]'}`}>
                            {notif.data?.title || 'إشعار جديد'}
                          </p>
                          <p className="text-[11px] text-[hsl(var(--muted))] mt-0.5 truncate">
                            {notif.data?.message}
                          </p>
                          <span className="text-[9px] text-[hsl(var(--muted))] mt-1 block">
                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ar })}
                          </span>
                        </div>
                        {isUnread && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsReadMutation.mutate(notif.id);
                            }}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-full self-start"
                            title="تحديد كمقروء"
                          >
                            <Check size={12} />
                          </button>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="p-6 text-center text-[hsl(var(--muted))] text-xs">
                    لا توجد إشعارات حالياً.
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]">
                <button 
                  onClick={() => {
                    setShowNotifications(false)
                    navigate('/notifications')
                  }}
                  className="w-full py-1.5 text-xs text-emerald-600 font-semibold hover:bg-emerald-50 rounded-lg transition-colors dark:hover:bg-emerald-900/20"
                >
                  عرض جميع الإشعارات
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <Link to="/settings" className="flex items-center gap-2 ps-2 border-s border-[hsl(var(--border))]">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0) ?? 'م'}
          </div>
          <span className="hidden md:block text-sm font-medium text-[hsl(var(--foreground))] max-w-[120px] truncate">
            {user?.name}
          </span>
        </Link>
      </div>
    </header>
  )
}
