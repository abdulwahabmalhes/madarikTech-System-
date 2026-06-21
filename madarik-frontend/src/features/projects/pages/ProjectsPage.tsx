import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import {
  FolderKanban, Plus, Search, AlertTriangle,
  Calendar, User, TrendingUp, Clock, CheckCircle2,
  PauseCircle, XCircle, Loader2, BarChart3
} from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; badge: string; icon: any }> = {
  'planning':    { label: 'تخطيط',    badge: 'badge-info',    icon: Loader2 },
  'in-progress': { label: 'جارٍ',     badge: 'badge-purple',  icon: TrendingUp },
  'on-hold':     { label: 'موقوف',    badge: 'badge-warning', icon: PauseCircle },
  'completed':   { label: 'مكتمل',   badge: 'badge-success', icon: CheckCircle2 },
  'cancelled':   { label: 'ملغي',    badge: 'badge-danger',  icon: XCircle },
}

const PRIORITY_MAP: Record<string, string> = {
  urgent: 'عاجل', high: 'مرتفع', normal: 'عادي', low: 'منخفض'
}

function HealthBar({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{score}</span>
    </div>
  )
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', client_id: '', status: 'planning', expected_end_date: '' })
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setShowAdd(false)
      setForm({ name: '', client_id: '', status: 'planning', expected_end_date: '' })
    }
  })

  const { data: clientsData } = useQuery({
    queryKey: ['clients-list'],
    queryFn: () => api.get('/clients', { params: { per_page: 100 } }).then(r => r.data)
  })
  const clientsList = clientsData?.data ?? []

  const { data, isLoading } = useQuery({
    queryKey: ['projects', search, statusFilter],
    queryFn: () =>
      api.get('/projects', {
        params: { per_page: 50, search: search || undefined, status: statusFilter || undefined }
      }).then(r => r.data),
  })

  const projects = data?.data ?? []

  const stats = {
    active: projects.filter((p: any) => p.status === 'in-progress').length,
    planning: projects.filter((p: any) => p.status === 'planning').length,
    completed: projects.filter((p: any) => p.status === 'completed').length,
    atRisk: projects.filter((p: any) => p.health_score < 60).length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">المشاريع</h2>
          <p className="text-sm text-[hsl(var(--muted))]">{projects.length} مشروع إجمالاً</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> مشروع جديد</button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'نشطة', value: stats.active, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/30' },
          { label: 'تخطيط', value: stats.planning, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'مكتملة', value: stats.completed, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'في خطر', value: stats.atRisk, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
        ].map(s => (
          <div key={s.label} className={`glass-card p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[hsl(var(--muted))] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[hsl(var(--muted))]" />
          <input
            type="text"
            placeholder="البحث في المشاريع..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input ps-9 h-9 py-2"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input h-9 py-2 w-36">
          <option value="">كل الحالات</option>
          {Object.entries(STATUS_MAP).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card h-52 animate-pulse bg-[hsl(var(--border))]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project: any) => {
            const status = STATUS_MAP[project.status] ?? { label: project.status, badge: 'badge-gray', icon: Loader2 }
            const isAtRisk = project.health_score < 60
            const isOverdue = project.expected_end_date && new Date(project.expected_end_date) < new Date() && project.status !== 'completed'

            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className={`glass-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block border-t-4 ${
                  isAtRisk ? 'border-t-red-400' : project.status === 'completed' ? 'border-t-emerald-400' : 'border-t-emerald-400'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 me-2">
                    <div className="font-semibold text-sm text-[hsl(var(--foreground))] mb-1 line-clamp-2 leading-tight">
                      {project.name}
                    </div>
                    <div className="text-xs text-[hsl(var(--muted))]">
                      {project.project_number}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${status.badge}`}>
                    {status.label}
                  </span>
                </div>

                {/* Client */}
                {project.client && (
                  <div className="flex items-center gap-1.5 mb-3 text-xs text-[hsl(var(--muted))]">
                    <User size={12} />
                    <span>{project.client.company_name || project.client.name}</span>
                  </div>
                )}

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[hsl(var(--muted))]">التقدم</span>
                    <span className="text-xs font-semibold text-[hsl(var(--foreground))]">{project.progress_percent}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${project.progress_percent}%`,
                        backgroundColor: project.progress_percent === 100 ? '#10b981' : '#3b82f6'
                      }}
                    />
                  </div>
                </div>

                {/* Health */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[hsl(var(--muted))]">صحة المشروع</span>
                    {isAtRisk && <AlertTriangle size={12} className="text-red-500" />}
                  </div>
                  <HealthBar score={project.health_score ?? 0} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))] text-xs text-[hsl(var(--muted))]">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                      {project.expected_end_date
                        ? new Date(project.expected_end_date).toLocaleDateString('ar-AE')
                        : '—'}
                    </span>
                    {isOverdue && <span className="text-red-500 font-medium">(متأخر)</span>}
                  </div>
                  {project.contract_value && (
                    <span className="font-semibold text-[hsl(var(--foreground))]">
                      {Number(project.contract_value).toLocaleString('ar-AE')} د.إ
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {!isLoading && projects.length === 0 && (
        <div className="glass-card p-12 text-center">
          <FolderKanban size={40} className="mx-auto text-[hsl(var(--muted))] mb-3" />
          <p className="text-[hsl(var(--muted))]">لا توجد مشاريع مطابقة</p>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="إضافة مشروع جديد">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">اسم المشروع</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" placeholder="اسم المشروع" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">العميل</label>
            <select value={form.client_id} onChange={e => setForm({...form, client_id: e.target.value})} className="form-input">
              <option value="">-- اختر العميل --</option>
              {clientsList.map((c: any) => (
                <option key={c.id} value={c.id}>{c.company_name || c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">تاريخ الانتهاء المتوقع</label>
            <input type="date" value={form.expected_end_date} onChange={e => setForm({...form, expected_end_date: e.target.value})} className="form-input" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button className="btn-secondary" onClick={() => setShowAdd(false)}>إلغاء</button>
            <button 
              className="btn-primary" 
              onClick={() => {
                const payload: any = { ...form }
                if (!payload.client_id) delete payload.client_id
                if (!payload.expected_end_date) delete payload.expected_end_date
                addMutation.mutate(payload as typeof form)
              }}
              disabled={!form.name || addMutation.isPending}
            >
              {addMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
