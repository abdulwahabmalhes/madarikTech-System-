import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import { 
  FolderKanban, Calendar, AlertTriangle, CheckCircle2, 
  ChevronRight, Users, Clock, AlignLeft, BarChart, FileText, FileSignature, Receipt, Link as LinkIcon
} from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  'planning':  { label: 'تخطيط',         badge: 'badge-gray' },
  'active':    { label: 'قيد التنفيذ',   badge: 'badge-info' },
  'on-hold':   { label: 'معلق',          badge: 'badge-warning' },
  'completed': { label: 'مكتمل',         badge: 'badge-success' },
  'cancelled': { label: 'ملغى',          badge: 'badge-danger' },
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('overview')

  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.get(`/projects/${id}`).then(r => r.data),
  })

  const completeTask = useMutation({
    mutationFn: (taskId: number) => api.post(`/tasks/${taskId}/complete`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', id] })
  })

  const reopenTask = useMutation({
    mutationFn: (taskId: number) => api.post(`/tasks/${taskId}/reopen`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', id] })
  })

  const [showEditDesc, setShowEditDesc] = useState(false)
  const [descForm, setDescForm] = useState({ description: '' })
  
  const [showAddTask, setShowAddTask] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', status: 'pending', due_date: '', priority: 'normal' })

  const updateDescMutation = useMutation({
    mutationFn: (data: typeof descForm) => api.put(`/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      setShowEditDesc(false)
    }
  })

  const addTaskMutation = useMutation({
    mutationFn: (data: typeof taskForm) => api.post(`/tasks`, { ...data, project_id: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setShowAddTask(false)
      setTaskForm({ title: '', status: 'pending', due_date: '', priority: 'normal' })
    }
  })

  const [showEditMetrics, setShowEditMetrics] = useState(false)
  const [metricsForm, setMetricsForm] = useState({ status: 'active', progress_percent: 0, health_score: 100 })

  const updateMetricsMutation = useMutation({
    mutationFn: (data: typeof metricsForm) => api.put(`/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      setShowEditMetrics(false)
    }
  })

  useEffect(() => {
    if (data) {
      setDescForm({ description: data.description || '' })
      setMetricsForm({ 
        status: data.status || 'active', 
        progress_percent: data.progress_percent || 0, 
        health_score: data.health_score || 0 
      })
    }
  }, [data])

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse text-[hsl(var(--muted))]">جاري تحميل بيانات المشروع...</div>
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">المشروع غير موجود</div>
  }

  const project = data
  const status = STATUS_MAP[project.status] ?? { label: project.status, badge: 'badge-gray' }
  const isOverdue = project.expected_end_date && new Date(project.expected_end_date) < new Date() && project.status !== 'completed'
  const tasks = project.tasks ?? []
  const quotations = project.quotations ?? []
  const contracts = project.contracts ?? []
  const invoices = project.invoices ?? []
  const expenses = project.expenses ?? []
  
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length
  const totalTasks = tasks.length

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/projects')} className="p-2 bg-[hsl(var(--surface))] rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] transition-colors">
          <ChevronRight size={18} />
        </button>
        <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">تفاصيل المشروع</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Project Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-t-4 border-t-emerald-500 relative overflow-hidden">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-xl font-bold text-[hsl(var(--foreground))] leading-tight">{project.name}</h3>
              <button 
                onClick={() => setShowEditMetrics(true)}
                className="text-xs btn-secondary py-1 px-2 border-dashed"
              >
                تحديث الحالة
              </button>
            </div>
            <div className="text-sm text-[hsl(var(--muted))] mb-4">{project.project_number}</div>
            
            <div className="flex items-center gap-2 mb-6">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${status.badge}`}>
                {status.label}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${project.health_score >= 80 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : project.health_score >= 50 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30' : 'bg-red-50 text-red-600 dark:bg-red-950/30'}`}>
                صحة المشروع: {project.health_score}%
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[hsl(var(--muted))]">نسبة الإنجاز</span>
                  <span className="font-bold">{project.progress_percent}%</span>
                </div>
                <div className="h-2.5 bg-[hsl(var(--surface))] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${project.progress_percent}%`,
                      backgroundColor: project.progress_percent === 100 ? '#10b981' : '#3b82f6'
                    }}
                  />
                </div>
              </div>

              {project.client && (
                <div className="flex flex-col gap-1.5 pt-3 border-t border-[hsl(var(--border))]">
                  <span className="text-xs text-[hsl(var(--muted))] flex items-center gap-1"><Users size={12}/> العميل المرتبط</span>
                  <Link to={`/clients/${project.client.id}`} className="text-sm font-semibold hover:text-emerald-600 transition-colors">
                    {project.client.company_name || project.client.name}
                  </Link>
                </div>
              )}

              <div className="flex flex-col gap-1.5 pt-3 border-t border-[hsl(var(--border))]">
                <span className="text-xs text-[hsl(var(--muted))] flex items-center gap-1"><Calendar size={12}/> الموعد النهائي</span>
                <div className={`text-sm font-medium ${isOverdue ? 'text-red-500' : 'text-[hsl(var(--foreground))]'}`}>
                  {project.expected_end_date ? new Date(project.expected_end_date).toLocaleDateString('ar-AE') : 'غير محدد'}
                  {isOverdue && ' (متأخر)'}
                </div>
              </div>

              {project.contract_value && (
                <div className="flex flex-col gap-1.5 pt-3 border-t border-[hsl(var(--border))]">
                  <span className="text-xs text-[hsl(var(--muted))] flex items-center gap-1"><BarChart size={12}/> قيمة المشروع</span>
                  <div className="text-sm font-bold text-[hsl(var(--foreground))]">
                    {Number(project.contract_value).toLocaleString('ar-AE')} د.إ
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {project.description && (
            <div className="glass-card p-5">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-[hsl(var(--muted))]">
                <AlignLeft size={16} /> وصف المشروع
              </h4>
              <p className="text-sm leading-relaxed text-[hsl(var(--foreground))] whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Content Tabs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4">
              <div className="text-xs text-[hsl(var(--muted))] mb-1">إجمالي المهام</div>
              <div className="text-2xl font-bold">{totalTasks}</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-xs text-[hsl(var(--muted))] mb-1">المهام المكتملة</div>
              <div className="text-2xl font-bold text-emerald-600">{completedTasks}</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-xs text-[hsl(var(--muted))] mb-1">المهام المعلقة</div>
              <div className="text-2xl font-bold text-emerald-600">{totalTasks - completedTasks}</div>
            </div>
            <div className="glass-card p-4">
              <div className="text-xs text-[hsl(var(--muted))] mb-1">عدد المراحل</div>
              <div className="text-2xl font-bold text-purple-600">{project.milestones?.length || 0}</div>
            </div>
          </div>

          {/* Tabs Header */}
          <div className="flex border-b border-[hsl(var(--border))] overflow-x-auto hide-scrollbar">
            {[
              { id: 'overview', label: 'نظرة عامة', icon: AlignLeft },
              { id: 'tasks', label: 'المهام', icon: CheckCircle2 },
              { id: 'quotations', label: 'عروض الأسعار', icon: FileText },
              { id: 'contracts', label: 'العقود', icon: FileSignature },
              { id: 'invoices', label: 'الفواتير', icon: Receipt },
              { id: 'expenses', label: 'المصروفات', icon: Receipt },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-emerald-600 text-emerald-600' 
                    : 'border-transparent text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-[hsl(var(--muted))]">
                      <AlignLeft size={16} /> وصف المشروع والمصادر
                    </h4>
                    <button 
                      onClick={() => setShowEditDesc(true)}
                      className="text-xs text-emerald-600 hover:underline"
                    >
                      تعديل الوصف
                    </button>
                  </div>
                  {project.description ? (
                    <div className="prose dark:prose-invert max-w-none text-sm text-[hsl(var(--foreground))] whitespace-pre-wrap leading-relaxed">
                      {project.description}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[hsl(var(--muted))] border border-dashed border-[hsl(var(--border))] rounded-xl">
                      لا يوجد وصف مسجل لهذا المشروع
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" /> مهام المشروع
                  </h3>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowAddTask(true)} className="text-xs btn-primary py-1.5 px-3">
                      + إضافة مهمة
                    </button>
                    <Link to="/tasks" className="text-xs text-emerald-600 hover:underline">إدارة كل المهام</Link>
                  </div>
                </div>
                
                {tasks.length > 0 ? (
                  <div className="space-y-3">
                    {tasks.map((task: any) => {
                      const isCompleted = task.status === 'completed'
                      const isPending = completeTask.isPending || reopenTask.isPending
                      
                      return (
                        <div key={task.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isCompleted ? 'border-[hsl(var(--border))] bg-[hsl(var(--surface))] opacity-75' : 'border-emerald-100 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-900/10'}`}>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => isCompleted ? reopenTask.mutate(task.id) : completeTask.mutate(task.id)}
                              disabled={isPending}
                              className={`p-1 rounded-md transition-colors ${isCompleted ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30' : 'text-gray-400 bg-white border hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700'}`}
                              title={isCompleted ? "إعادة فتح المهمة" : "تحديد كمكتملة"}
                            >
                              <CheckCircle2 size={20} className={isCompleted ? 'opacity-100' : 'opacity-20'} />
                            </button>
                            <span className={`text-sm ${isCompleted ? 'line-through text-[hsl(var(--muted))]' : 'font-medium'}`}>
                              {task.title}
                            </span>
                          </div>
                          <div className="text-xs text-[hsl(var(--muted))]">
                            {task.due_date ? new Date(task.due_date).toLocaleDateString('ar-AE') : ''}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[hsl(var(--muted))] border border-dashed border-[hsl(var(--border))] rounded-xl">
                    لا توجد مهام مسجلة لهذا المشروع
                  </div>
                )}
              </div>
            )}

            {activeTab === 'quotations' && (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <FileText size={18} className="text-emerald-500" /> عروض الأسعار
                  </h3>
                  <Link to={`/quotations/create?project=${project.id}`} className="text-xs btn-primary py-1.5 px-3">
                    إنشاء عرض جديد
                  </Link>
                </div>
                {quotations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[hsl(var(--border))] text-[hsl(var(--muted))] text-right">
                          <th className="pb-3 font-medium">الرقم</th>
                          <th className="pb-3 font-medium">التاريخ</th>
                          <th className="pb-3 font-medium">القيمة</th>
                          <th className="pb-3 font-medium">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotations.map((q: any) => (
                          <tr key={q.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--surface-hover))]">
                            <td className="py-3">
                              <Link to={`/quotations/${q.id}`} className="font-medium text-emerald-600 hover:underline">{q.quotation_number}</Link>
                            </td>
                            <td className="py-3 text-[hsl(var(--muted))]">{new Date(q.created_at).toLocaleDateString('ar-AE')}</td>
                            <td className="py-3 font-semibold">{Number(q.total).toLocaleString('ar-AE')} د.إ</td>
                            <td className="py-3">
                              <span className="text-xs badge-gray">{q.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[hsl(var(--muted))] border border-dashed border-[hsl(var(--border))] rounded-xl">
                    لا توجد عروض أسعار مرتبطة
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contracts' && (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <FileSignature size={18} className="text-purple-500" /> العقود
                  </h3>
                  <Link to={`/contracts/create?project=${project.id}`} className="text-xs btn-primary py-1.5 px-3">
                    إنشاء عقد جديد
                  </Link>
                </div>
                {contracts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[hsl(var(--border))] text-[hsl(var(--muted))] text-right">
                          <th className="pb-3 font-medium">رقم العقد</th>
                          <th className="pb-3 font-medium">تاريخ البداية</th>
                          <th className="pb-3 font-medium">تاريخ النهاية</th>
                          <th className="pb-3 font-medium">القيمة</th>
                          <th className="pb-3 font-medium">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contracts.map((c: any) => (
                          <tr key={c.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--surface-hover))]">
                            <td className="py-3">
                              <Link to={`/contracts/${c.id}`} className="font-medium text-emerald-600 hover:underline">{c.contract_number}</Link>
                            </td>
                            <td className="py-3 text-[hsl(var(--muted))]">{c.start_date ? new Date(c.start_date).toLocaleDateString('ar-AE') : '-'}</td>
                            <td className="py-3 text-[hsl(var(--muted))]">{c.end_date ? new Date(c.end_date).toLocaleDateString('ar-AE') : '-'}</td>
                            <td className="py-3 font-semibold">{Number(c.value).toLocaleString('ar-AE')} د.إ</td>
                            <td className="py-3">
                              <span className="text-xs badge-gray">{c.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[hsl(var(--muted))] border border-dashed border-[hsl(var(--border))] rounded-xl">
                    لا توجد عقود مرتبطة
                  </div>
                )}
              </div>
            )}

              {activeTab === 'invoices' && (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Receipt size={18} className="text-emerald-500" /> الفواتير
                  </h3>
                  <Link to={`/invoices/create?project=${project.id}`} className="text-xs btn-primary py-1.5 px-3">
                    إنشاء فاتورة جديدة
                  </Link>
                </div>
                {invoices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[hsl(var(--border))] text-[hsl(var(--muted))] text-right">
                          <th className="pb-3 font-medium">رقم الفاتورة</th>
                          <th className="pb-3 font-medium">تاريخ الإصدار</th>
                          <th className="pb-3 font-medium">تاريخ الاستحقاق</th>
                          <th className="pb-3 font-medium">القيمة الإجمالية</th>
                          <th className="pb-3 font-medium">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((inv: any) => (
                          <tr key={inv.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--surface-hover))]">
                            <td className="py-3">
                              <Link to={`/invoices/${inv.id}`} className="font-medium text-emerald-600 hover:underline">{inv.invoice_number}</Link>
                            </td>
                            <td className="py-3 text-[hsl(var(--muted))]">{inv.issue_date ? new Date(inv.issue_date).toLocaleDateString('ar-AE') : '-'}</td>
                            <td className="py-3 text-[hsl(var(--muted))]">{inv.due_date ? new Date(inv.due_date).toLocaleDateString('ar-AE') : '-'}</td>
                            <td className="py-3 font-semibold">{Number(inv.total).toLocaleString('ar-AE')} د.إ</td>
                            <td className="py-3">
                              <span className="text-xs badge-gray">{inv.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[hsl(var(--muted))] border border-dashed border-[hsl(var(--border))] rounded-xl">
                    لا توجد فواتير مرتبطة
                  </div>
                )}
              </div>
            )}

            {activeTab === 'expenses' && (
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Receipt size={18} className="text-red-500" /> المصروفات
                  </h3>
                  <Link to={`/expenses`} className="text-xs btn-primary py-1.5 px-3">
                    إدارة المصروفات
                  </Link>
                </div>
                {expenses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[hsl(var(--border))] text-[hsl(var(--muted))] text-right">
                          <th className="pb-3 font-medium">العنوان</th>
                          <th className="pb-3 font-medium">الفئة</th>
                          <th className="pb-3 font-medium">التاريخ</th>
                          <th className="pb-3 font-medium">المبلغ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.map((exp: any) => (
                          <tr key={exp.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--surface-hover))]">
                            <td className="py-3 font-medium">{exp.title}</td>
                            <td className="py-3 text-[hsl(var(--muted))]">
                              <span className="badge-gray text-xs px-2 py-0.5 rounded-full">{exp.category}</span>
                            </td>
                            <td className="py-3 text-[hsl(var(--muted))]">{exp.date ? new Date(exp.date).toLocaleDateString('ar-AE') : '-'}</td>
                            <td className="py-3 font-semibold text-red-600">{Number(exp.amount).toLocaleString('ar-AE')} د.إ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-[hsl(var(--muted))] border border-dashed border-[hsl(var(--border))] rounded-xl">
                    لا توجد مصروفات مرتبطة بهذا المشروع
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Edit Description Modal */}
      <Modal isOpen={showEditDesc} onClose={() => setShowEditDesc(false)} title="تعديل وصف المشروع والمصادر">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">الوصف (يمكنك إضافة لينكات ومصادر هنا)</label>
            <textarea 
              value={descForm.description} 
              onChange={e => setDescForm({...descForm, description: e.target.value})} 
              className="form-input min-h-[150px] resize-y" 
              placeholder="اكتب وصف المشروع، أضف روابط هامة، ومصادر للمشروع..." 
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button className="btn-secondary" onClick={() => setShowEditDesc(false)}>إلغاء</button>
            <button 
              className="btn-primary" 
              onClick={() => updateDescMutation.mutate(descForm)}
              disabled={updateDescMutation.isPending}
            >
              {updateDescMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Task Modal */}
      <Modal isOpen={showAddTask} onClose={() => setShowAddTask(false)} title="إضافة مهمة جديدة">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">عنوان المهمة</label>
            <input 
              value={taskForm.title} 
              onChange={e => setTaskForm({...taskForm, title: e.target.value})} 
              className="form-input" 
              placeholder="اكتب عنوان المهمة..." 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">الموعد النهائي</label>
              <input 
                type="date"
                value={taskForm.due_date} 
                onChange={e => setTaskForm({...taskForm, due_date: e.target.value})} 
                className="form-input" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">الأولوية</label>
              <select 
                value={taskForm.priority} 
                onChange={e => setTaskForm({...taskForm, priority: e.target.value})} 
                className="form-input"
              >
                <option value="low">منخفضة</option>
                <option value="normal">عادية</option>
                <option value="high">مرتفعة</option>
                <option value="urgent">عاجلة</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button className="btn-secondary" onClick={() => setShowAddTask(false)}>إلغاء</button>
            <button 
              className="btn-primary" 
              onClick={() => addTaskMutation.mutate(taskForm)}
              disabled={!taskForm.title || addTaskMutation.isPending}
            >
              {addTaskMutation.isPending ? 'جارٍ الحفظ...' : 'إضافة'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Metrics Modal */}
      <Modal isOpen={showEditMetrics} onClose={() => setShowEditMetrics(false)} title="تحديث حالة المشروع">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">حالة المشروع</label>
            <select 
              value={metricsForm.status} 
              onChange={e => setMetricsForm({...metricsForm, status: e.target.value})} 
              className="form-input"
            >
              {Object.entries(STATUS_MAP).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex justify-between text-xs font-medium text-[hsl(var(--muted))] mb-1.5">
              <label>نسبة الإنجاز</label>
              <span>{metricsForm.progress_percent}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={metricsForm.progress_percent} 
              onChange={e => setMetricsForm({...metricsForm, progress_percent: Number(e.target.value)})} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-medium text-[hsl(var(--muted))] mb-1.5">
              <label>صحة المشروع</label>
              <span className={metricsForm.health_score >= 80 ? 'text-emerald-500' : metricsForm.health_score >= 50 ? 'text-amber-500' : 'text-red-500'}>
                {metricsForm.health_score}%
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={metricsForm.health_score} 
              onChange={e => setMetricsForm({...metricsForm, health_score: Number(e.target.value)})} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button className="btn-secondary" onClick={() => setShowEditMetrics(false)}>إلغاء</button>
            <button 
              className="btn-primary" 
              onClick={() => updateMetricsMutation.mutate(metricsForm)}
              disabled={updateMetricsMutation.isPending}
            >
              {updateMetricsMutation.isPending ? 'جارٍ الحفظ...' : 'تحديث'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
