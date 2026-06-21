import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '@/lib/api'
import { Users2, Plus, MapPin, Video, Calendar, User } from 'lucide-react'
import { MeetingFormModal } from '../components/MeetingFormModal'

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  scheduled: { label: 'مجدول',       badge: 'badge-info' },
  done:      { label: 'تم الاجتماع', badge: 'badge-success' },
  cancelled: { label: 'ملغي',        badge: 'badge-danger' },
  postponed: { label: 'مؤجل',       badge: 'badge-warning' },
}

const TYPE_MAP: Record<string, { label: string; icon: string }> = {
  online:    { label: 'أونلاين',  icon: '💻' },
  in_person: { label: 'حضوري',  icon: '🤝' },
  phone:     { label: 'هاتفي',   icon: '📞' },
}

export default function MeetingsPage() {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editMeeting, setEditMeeting] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['meetings', search],
    queryFn: () =>
      api.get('/meetings', { params: { per_page: 50, search: search || undefined } }).then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/meetings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
      alert('تم حذف الاجتماع بنجاح')
    }
  })

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الاجتماع؟')) {
      deleteMutation.mutate(id)
    }
  }

  const meetings = data?.data ?? []

  const upcoming = meetings.filter((m: any) =>
    m.status === 'scheduled' && m.date && new Date(m.date) >= new Date(new Date().setHours(0,0,0,0))
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">الاجتماعات</h2>
          <p className="text-sm text-[hsl(var(--muted))]">
            {meetings.length} اجتماع • {upcoming.length} قادم
          </p>
        </div>
        <button onClick={() => { setEditMeeting(null); setIsModalOpen(true); }} className="btn-primary"><Plus size={16} /> جدولة اجتماع</button>
      </div>

      {isModalOpen && <MeetingFormModal meeting={editMeeting} onClose={() => setIsModalOpen(false)} />}

      {upcoming.length > 0 && (
        <div className="glass-card p-4 bg-emerald-50 dark:bg-emerald-950/20 border-s-4 border-emerald-500">
          <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">📅 الاجتماعات القادمة</div>
          <div className="space-y-2">
            {upcoming.slice(0, 3).map((m: any) => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{TYPE_MAP[m.type]?.icon ?? '📋'}</span>
                  <span className="font-medium text-[hsl(var(--foreground))]">{m.title}</span>
                  {m.client && <span className="text-[hsl(var(--muted))] text-xs">— {m.client.name}</span>}
                </div>
                <span className="text-xs text-emerald-600 font-medium">
                  {new Date(m.date).toLocaleDateString('ar-AE', { weekday: 'short', month: 'short', day: 'numeric' })} {m.start_time ? ' - ' + m.start_time : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-[hsl(var(--border))] animate-pulse rounded-lg" />)}
          </div>
        ) : meetings.length > 0 ? (
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-start">الموضوع</th>
                <th className="text-start">العميل</th>
                <th className="text-start">النوع</th>
                <th className="text-start">التاريخ والوقت</th>
                <th className="text-start">الحالة</th>
                <th className="text-start">المسؤول</th>
                <th className="text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((m: any) => {
                const st = STATUS_MAP[m.status] ?? { label: m.status, badge: 'badge-gray' }
                const tp = TYPE_MAP[m.type] ?? { label: m.type, icon: '📋' }
                return (
                  <tr key={m.id}>
                    <td className="font-medium text-sm">{m.title}</td>
                    <td className="text-xs text-[hsl(var(--muted))]">
                      {m.client?.company_name || m.client?.name || '—'}
                    </td>
                    <td>
                      <span className="text-xs flex items-center gap-1">
                        <span>{tp.icon}</span> {tp.label}
                      </span>
                    </td>
                    <td className="text-xs text-[hsl(var(--muted))]">
                      {m.date
                        ? `${new Date(m.date).toLocaleDateString('ar-AE', { year: 'numeric', month: 'short', day: 'numeric' })} ${m.start_time ? ' - ' + m.start_time : ''}`
                        : '—'}
                    </td>
                    <td><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.badge}`}>{st.label}</span></td>
                    <td className="text-xs text-[hsl(var(--muted))]">{m.created_user?.name ?? '—'}</td>
                    <td className="text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditMeeting(m); setIsModalOpen(true); }} className="text-emerald-500 hover:text-emerald-700 text-xs font-medium">تعديل/تأجيل</button>
                        <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">حذف</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-[hsl(var(--muted))]">
            <Users2 size={36} className="mx-auto mb-2 opacity-30" />
            لا توجد اجتماعات مسجّلة
          </div>
        )}
      </div>
    </div>
  )
}
