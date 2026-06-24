import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import {
  CheckSquare, Plus, Search, CheckCircle2,
  Clock, AlertTriangle, User, Calendar, Flag, Edit2, Trash2
} from 'lucide-react'

const STATUS_COLS = [
  { key: 'pending',     label: 'قيد الانتظار',  bg: 'bg-gray-50 dark:bg-gray-900/50',      badge: 'badge-gray' },
  { key: 'in-progress', label: 'جارٍ التنفيذ',  bg: 'bg-emerald-50 dark:bg-emerald-950/30',       badge: 'badge-info' },
  { key: 'review',      label: 'مراجعة',         bg: 'bg-amber-50 dark:bg-amber-950/30',     badge: 'badge-warning' },
  { key: 'completed',   label: 'مكتملة',         bg: 'bg-emerald-50 dark:bg-emerald-950/30', badge: 'badge-success' },
]

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  urgent: { label: 'عاجل',    color: 'text-red-500' },
  high:   { label: 'مرتفع',  color: 'text-amber-500' },
  normal: { label: 'عادي',   color: 'text-emerald-500' },
  low:    { label: 'منخفض', color: 'text-gray-400' },
}

function isOverdue(dueDate: string, status: string) {
  if (status === 'completed') return false
  return dueDate && new Date(dueDate) < new Date()
}

export default function TasksPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'kanban' | 'list'>('kanban')

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', project_id: '', assigned_to: '', priority: 'normal', due_date: '', status: 'pending' })
  const [taskToEdit, setTaskToEdit] = useState<any>(null)

  const addMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/tasks', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setShowAdd(false)
      setForm({ title: '', project_id: '', assigned_to: '', priority: 'normal', due_date: '', status: 'pending' })
    }
  })

  const editMutation = useMutation({
    mutationFn: (data: typeof form) => api.put(`/tasks/${taskToEdit.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setShowAdd(false)
      setTaskToEdit(null)
      setForm({ title: '', project_id: '', assigned_to: '', priority: 'normal', due_date: '', status: 'pending' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
  })

  const { data: projectsData } = useQuery({
    queryKey: ['projects-list'],
    queryFn: () => api.get('/projects', { params: { per_page: 100 } }).then(r => r.data)
  })
  const projectsList = projectsData?.data ?? []

  const { data: usersData } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => api.get('/team', { params: { per_page: 100 } }).then(r => r.data)
  })
  const usersList = usersData?.data ?? []

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', search],
    queryFn: () =>
      api.get('/tasks', {
        params: { per_page: 100, search: search || undefined }
      }).then(r => r.data),
  })

  const completeMutation = useMutation({
    mutationFn: (id: number) => api.post(`/tasks/${id}/complete`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.put(`/tasks/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const tasks = data?.data ?? []
  const overdueCnt = tasks.filter((t: any) => isOverdue(t.due_date, t.status)).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">المهام</h2>
          <p className="text-sm text-[hsl(var(--muted))]">
            {tasks.length} مهمة
            {overdueCnt > 0 && <span className="text-red-500 ms-2">• {overdueCnt} متأخرة</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 border border-[hsl(var(--border))] rounded-lg p-0.5 bg-[hsl(var(--surface))]">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'kanban' ? 'bg-emerald-600 text-white' : 'text-[hsl(var(--muted))]'}`}
            >كانبان</button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'list' ? 'bg-emerald-600 text-white' : 'text-[hsl(var(--muted))]'}`}
            >قائمة</button>
          </div>
          <button className="btn-primary" onClick={() => {
            setTaskToEdit(null)
            setForm({ title: '', project_id: '', assigned_to: '', priority: 'normal', due_date: '', status: 'pending' })
            setShowAdd(true)
          }}><Plus size={16} /> مهمة جديدة</button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[hsl(var(--muted))]" />
        <input
          type="text"
          placeholder="البحث في المهام..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input ps-9 h-9 py-2"
        />
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start w-full">
          {STATUS_COLS.map(col => (
            <div key={col.key} className="flex-1 min-w-[280px] space-y-2">
              <div className="h-8 bg-[hsl(var(--border))] animate-pulse rounded-lg" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 bg-[hsl(var(--border))] animate-pulse rounded-xl" />
              ))}
            </div>
          ))}
        </div>
      ) : view === 'kanban' ? (
        /* Kanban */
        <div className="flex gap-4 overflow-x-auto pb-4 items-start w-full">
          {STATUS_COLS.map(col => {
            const colTasks = tasks.filter((t: any) => t.status === col.key)
            return (
              <div key={col.key} className={`flex-1 min-w-[280px] rounded-xl p-3 ${col.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${col.badge}`}>
                    {col.label}
                  </span>
                  <span className="text-xs text-[hsl(var(--muted))] bg-white/50 dark:bg-white/10 px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-16">
                  {colTasks.map((task: any) => {
                    const overdue = isOverdue(task.due_date, task.status)
                    const priority = PRIORITY_MAP[task.priority] ?? { label: task.priority, color: 'text-gray-400' }
                    return (
                      <div
                        key={task.id}
                        className={`bg-[hsl(var(--surface))] rounded-xl p-3 shadow-sm border ${overdue ? 'border-red-300' : 'border-[hsl(var(--border))]'} hover:shadow-md transition-all`}
                      >
                        {/* Title */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() => task.status !== 'completed' && completeMutation.mutate(task.id)}
                              className={`mt-0.5 flex-shrink-0 transition-colors ${task.status === 'completed' ? 'text-emerald-500' : 'text-[hsl(var(--muted))] hover:text-emerald-500'}`}
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <span className={`text-sm font-medium leading-snug ${task.status === 'completed' ? 'line-through text-[hsl(var(--muted))]' : 'text-[hsl(var(--foreground))]'}`}>
                              {task.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity" style={{ opacity: 1 /* Force visible on mobile, or just show it always */ }}>
                            <button 
                              onClick={() => {
                                setTaskToEdit(task)
                                setForm({
                                  title: task.title,
                                  project_id: task.project_id || '',
                                  assigned_to: task.assigned_to || '',
                                  priority: task.priority || 'normal',
                                  due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
                                  status: task.status || 'pending'
                                })
                                setShowAdd(true)
                              }}
                              className="p-1 text-[hsl(var(--muted))] hover:text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) deleteMutation.mutate(task.id)
                              }}
                              className="p-1 text-[hsl(var(--muted))] hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Project */}
                        {task.project && (
                          <div className="text-xs text-[hsl(var(--muted))] mb-1.5 truncate">
                            📁 {task.project.name}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Flag size={11} className={priority.color} />
                            <span className={`text-[10px] ${priority.color}`}>{priority.label}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 ms-auto">
                            {task.due_date && (
                              <div className={`flex items-center gap-1 text-[10px] ${overdue ? 'text-red-500 font-medium' : 'text-[hsl(var(--muted))]'}`}>
                                {overdue ? <AlertTriangle size={10} /> : <Calendar size={10} />}
                                {new Date(task.due_date).toLocaleDateString('ar-AE', { month: 'short', day: 'numeric' })}
                              </div>
                            )}
                            
                            <select
                              value={task.status}
                              onChange={e => statusMutation.mutate({ id: task.id, status: e.target.value })}
                              className="text-[10px] border border-[hsl(var(--border))] rounded px-1.5 py-0.5 bg-[hsl(var(--surface))] cursor-pointer text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
                            >
                              {STATUS_COLS.map(s => (
                                <option key={s.key} value={s.key}>{s.label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Assigned */}
                        {task.assigned_user && (
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-[hsl(var(--muted))]">
                            <User size={11} />
                            {task.assigned_user.name}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {colTasks.length === 0 && (
                    <div className="text-center text-xs text-[hsl(var(--muted-foreground))] py-6">لا توجد مهام</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div className="glass-card overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-start w-8"></th>
                <th className="text-start">المهمة</th>
                <th className="text-start">المشروع</th>
                <th className="text-start">المسؤول</th>
                <th className="text-start">الأولوية</th>
                <th className="text-start">تاريخ الاستحقاق</th>
                <th className="text-start">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task: any) => {
                const overdue = isOverdue(task.due_date, task.status)
                const priority = PRIORITY_MAP[task.priority] ?? { label: task.priority, color: 'text-gray-400' }
                return (
                  <tr key={task.id}>
                    <td>
                      <button
                        onClick={() => task.status !== 'completed' && completeMutation.mutate(task.id)}
                        className={`transition-colors ${task.status === 'completed' ? 'text-emerald-500' : 'text-[hsl(var(--muted))] hover:text-emerald-500'}`}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    </td>
                    <td>
                      <span className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-[hsl(var(--muted))]' : 'text-[hsl(var(--foreground))]'}`}>
                        {task.title}
                      </span>
                    </td>
                    <td className="text-xs text-[hsl(var(--muted))] max-w-32 truncate">
                      {task.project?.name ?? '—'}
                    </td>
                    <td className="text-xs text-[hsl(var(--muted))]">
                      {task.assigned_user?.name ?? '—'}
                    </td>
                    <td>
                      <span className={`text-xs font-medium ${priority.color}`}>{priority.label}</span>
                    </td>
                    <td>
                      <span className={`text-xs ${overdue ? 'text-red-500 font-semibold' : 'text-[hsl(var(--muted))]'}`}>
                        {task.due_date ? new Date(task.due_date).toLocaleDateString('ar-AE') : '—'}
                        {overdue && ' ⚠️'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <select
                          value={task.status}
                          onChange={e => statusMutation.mutate({ id: task.id, status: e.target.value })}
                          className="text-xs border border-[hsl(var(--border))] rounded-lg px-2 py-1 bg-[hsl(var(--surface))] cursor-pointer"
                        >
                          {STATUS_COLS.map(s => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => {
                            setTaskToEdit(task)
                            setForm({
                              title: task.title,
                              project_id: task.project_id || '',
                              assigned_to: task.assigned_to || '',
                              priority: task.priority || 'normal',
                              due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
                              status: task.status || 'pending'
                            })
                            setShowAdd(true)
                          }}
                          className="p-1 text-[hsl(var(--muted))] hover:text-emerald-600 rounded"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) deleteMutation.mutate(task.id)
                          }}
                          className="p-1 text-[hsl(var(--muted))] hover:text-red-600 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {tasks.length === 0 && (
            <div className="text-center py-12 text-[hsl(var(--muted))]">لا توجد مهام</div>
          )}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setTaskToEdit(null); }} title={taskToEdit ? "تعديل المهمة" : "إضافة مهمة جديدة"}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">عنوان المهمة</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="form-input" placeholder="عنوان المهمة" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">المشروع</label>
            <select value={form.project_id} onChange={e => setForm({...form, project_id: e.target.value})} className="form-input">
              <option value="">-- اختر المشروع --</option>
              {projectsList.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">المسؤول</label>
            <select value={form.assigned_to} onChange={e => setForm({...form, assigned_to: e.target.value})} className="form-input">
              <option value="">-- غير معين --</option>
              {usersList.map((u: any) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">الأولوية</label>
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="form-input">
                <option value="urgent">عاجل</option>
                <option value="high">مرتفع</option>
                <option value="normal">عادي</option>
                <option value="low">منخفض</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">تاريخ الاستحقاق</label>
              <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="form-input" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button className="btn-secondary" onClick={() => { setShowAdd(false); setTaskToEdit(null); }}>إلغاء</button>
            <button 
              className="btn-primary" 
              onClick={() => taskToEdit ? editMutation.mutate(form) : addMutation.mutate(form)}
              disabled={!form.title || addMutation.isPending || editMutation.isPending}
            >
              {addMutation.isPending || editMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
