import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Bell, CheckCircle2, Circle, Clock, Users, FolderGit2, CheckSquare, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export default function NotificationsPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState('all') // all, unread

  const { data: responseData, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then(r => r.data),
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.post(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.post('/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  })

  const notifications = responseData?.notifications?.data || responseData?.notifications || []
  
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter((n: any) => !n.read_at)
    : notifications

  const getIcon = (type: string) => {
    switch(type) {
      case 'lead': return <Users className="text-blue-500" size={20} />
      case 'project': return <FolderGit2 className="text-purple-500" size={20} />
      case 'task': return <CheckSquare className="text-amber-500" size={20} />
      case 'renewal': return <RefreshCw className="text-emerald-500" size={20} />
      default: return <Bell className="text-gray-500" size={20} />
    }
  }

  const getBackgroundColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-[hsl(var(--surface))] opacity-70'
    switch(type) {
      case 'lead': return 'bg-blue-50 dark:bg-blue-900/10 border-s-4 border-blue-500'
      case 'project': return 'bg-purple-50 dark:bg-purple-900/10 border-s-4 border-purple-500'
      case 'task': return 'bg-amber-50 dark:bg-amber-900/10 border-s-4 border-amber-500'
      case 'renewal': return 'bg-emerald-50 dark:bg-emerald-900/10 border-s-4 border-emerald-500'
      default: return 'bg-[hsl(var(--surface))] border-s-4 border-gray-500'
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
            <Bell className="text-blue-500" /> مركز الإشعارات
          </h2>
          <p className="text-[hsl(var(--muted))] mt-1">
            تابع أحدث التنبيهات، المواعيد المقتربة، وتحديثات العملاء.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending || notifications.every((n: any) => n.read_at)}
            className="btn-secondary"
          >
            <CheckCircle2 size={18} /> تحديد الكل كمقروء
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-[hsl(var(--border))] pb-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${filter === 'all' ? 'text-blue-600' : 'text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}
        >
          كل الإشعارات
          {filter === 'all' && <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></span>}
        </button>
        <button 
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 font-medium text-sm transition-colors relative ${filter === 'unread' ? 'text-blue-600' : 'text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}
        >
          غير المقروءة فقط
          {filter === 'unread' && <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></span>}
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-[hsl(var(--muted))]">جاري التحميل...</div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification: any) => {
            const data = notification.data || {}
            const isRead = !!notification.read_at

            return (
              <div 
                key={notification.id} 
                className={`p-5 rounded-2xl transition-all duration-200 ${getBackgroundColor(data.type, isRead)}`}
              >
                <div className="flex gap-4">
                  <div className={`mt-1 p-3 rounded-full bg-white dark:bg-black/20 shadow-sm flex-shrink-0`}>
                    {getIcon(data.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className={`font-bold text-lg ${isRead ? 'text-[hsl(var(--muted))]' : 'text-[hsl(var(--foreground))]'}`}>
                          {data.title || 'إشعار جديد'}
                        </h3>
                        <p className={`mt-1 ${isRead ? 'text-[hsl(var(--muted))]' : 'text-[hsl(var(--foreground))] text-opacity-80'}`}>
                          {data.message}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-xs text-[hsl(var(--muted))] flex items-center gap-1">
                          <Clock size={12} />
                          {format(new Date(notification.created_at), 'PP p', { locale: ar })}
                        </span>
                        {!isRead && (
                          <button 
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                            className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-full transition-colors flex items-center gap-1 dark:hover:bg-blue-900/20"
                          >
                            <Circle size={12} /> تعيين كمقروء
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-16 glass-card rounded-3xl">
            <Bell className="w-16 h-16 mx-auto mb-4 opacity-20 text-[hsl(var(--muted))]" />
            <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mb-2">لا توجد إشعارات</h3>
            <p className="text-[hsl(var(--muted))]">أنت على اطلاع بكل جديد! لا توجد إشعارات {filter === 'unread' ? 'غير مقروءة' : ''} في الوقت الحالي.</p>
          </div>
        )}
      </div>
    </div>
  )
}
