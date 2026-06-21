import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { 
  Building2, Phone, Mail, MapPin, Tag, Briefcase, 
  Wallet, FileText, ChevronRight, Activity, Globe,
  CheckCircle2, Clock
} from 'lucide-react'

const TYPE_MAP: Record<string, string> = {
  company: 'شركة', individual: 'فرد'
}

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => api.get(`/clients/${id}`).then(r => r.data),
  })

  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('projects')

  const statusMutation = useMutation({
    mutationFn: (status: string) => api.put(`/clients/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['client', id] })
  })

  // We can fetch financials from custom endpoint or assume the backend provided them if we expand the backend.
  // For now, let's use the financials endpoint if needed, or just display the loaded projects.
  const { data: financialsData } = useQuery({
    queryKey: ['client-financials', id],
    queryFn: () => api.get(`/clients/${id}/financials`).then(r => r.data),
  })

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse text-[hsl(var(--muted))]">جاري تحميل بيانات العميل...</div>
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">العميل غير موجود</div>
  }

  const client = data
  const financials = financialsData || { total_invoiced: 0, total_paid: 0, outstanding: 0 }
  const projects = client.projects ?? []

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/clients')} className="p-2 bg-[hsl(var(--surface))] rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] transition-colors">
          <ChevronRight size={18} />
        </button>
        <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">تفاصيل العميل</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-[100px] -z-10" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {client.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[hsl(var(--foreground))] mb-1">{client.name}</h3>
                
                {client.client_code && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-mono font-bold tracking-wider">
                      {client.client_code}
                    </span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(client.client_code)}
                      className="text-[hsl(var(--muted))] hover:text-emerald-500 transition-colors"
                      title="نسخ الكود"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
                )}

                {client.company_name && (
                  <div className="text-sm text-[hsl(var(--muted))] flex items-center gap-1.5">
                    <Building2 size={14} /> {client.company_name}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))]">
                <span className="text-xs text-[hsl(var(--muted))]">الحالة</span>
                <select 
                  value={client.status}
                  onChange={(e) => statusMutation.mutate(e.target.value)}
                  disabled={statusMutation.isPending}
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold border-none outline-none cursor-pointer ${
                    client.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 
                    client.status === 'on-hold' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30' : 
                    'bg-gray-50 text-gray-600 dark:bg-gray-900'
                  }`}
                >
                  <option value="active">نشط</option>
                  <option value="on-hold">موقوف</option>
                  <option value="closed">مغلق</option>
                </select>
              </div>

              {client.lead && (
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                    <Activity size={14} /> موقع العميل في المبيعات
                  </span>
                  <div className="flex justify-between text-xs">
                    <span className="text-[hsl(var(--muted))]">المصدر:</span>
                    <span className="font-semibold">{client.lead.source || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-[hsl(var(--muted))]">المرحلة:</span>
                    <span className="font-semibold text-emerald-600">✅ تم الفوز (محول)</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted))]">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--surface))] flex items-center justify-center text-emerald-500 shrink-0">
                  <Phone size={14} />
                </div>
                <a href={`tel:${client.mobile}`} className="hover:text-emerald-600 transition-colors" dir="ltr">{client.mobile}</a>
              </div>
              {client.email && (
                <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted))]">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--surface))] flex items-center justify-center text-green-500 shrink-0">
                    <Mail size={14} />
                  </div>
                  <a href={`mailto:${client.email}`} className="hover:text-green-600 transition-colors">{client.email}</a>
                </div>
              )}
              {(client.city || client.country) && (
                <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted))]">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--surface))] flex items-center justify-center text-emerald-500 shrink-0">
                    <MapPin size={14} />
                  </div>
                  <span>{[client.city, client.country].filter(Boolean).join('، ')}</span>
                </div>
              )}
              {client.industry && (
                <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted))]">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--surface))] flex items-center justify-center text-amber-500 shrink-0">
                    <Briefcase size={14} />
                  </div>
                  <span>{client.industry}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-[hsl(var(--border))]">
              <div className="flex items-center justify-between text-xs text-[hsl(var(--muted))]">
                <span>تاريخ الإضافة</span>
                <span dir="ltr">{new Date(client.created_at).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
          </div>

          {/* Contact Person / Assignee */}
          {client.assigned_user && (
            <div className="glass-card p-5">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Globe size={16} className="text-[hsl(var(--muted))]" /> مسؤول الحساب
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[hsl(var(--muted))]">
                  {client.assigned_user.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium">{client.assigned_user.name}</div>
                  <div className="text-xs text-[hsl(var(--muted))]">مدير العلاقة</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Financials Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card p-5 border-t-4 border-t-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-[hsl(var(--muted))]">إجمالي الفواتير</h4>
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg"><Wallet size={14} /></div>
              </div>
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{Number(financials.total_invoiced).toLocaleString('ar-AE')} <span className="text-sm font-normal text-[hsl(var(--muted))]">د.إ</span></div>
            </div>
            <div className="glass-card p-5 border-t-4 border-t-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-[hsl(var(--muted))]">المبالغ المدفوعة</h4>
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg"><CheckCircle2 size={14} /></div>
              </div>
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{Number(financials.total_paid).toLocaleString('ar-AE')} <span className="text-sm font-normal text-[hsl(var(--muted))]">د.إ</span></div>
            </div>
            <div className="glass-card p-5 border-t-4 border-t-amber-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-[hsl(var(--muted))]">المبالغ المستحقة</h4>
                <div className="p-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-lg"><Clock size={14} /></div>
              </div>
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{Number(financials.outstanding).toLocaleString('ar-AE')} <span className="text-sm font-normal text-[hsl(var(--muted))]">د.إ</span></div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="glass-card overflow-hidden">
            <div className="flex border-b border-[hsl(var(--border))] overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'projects' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}
              >
                المشاريع
              </button>
              <button 
                onClick={() => setActiveTab('invoices')}
                className={`px-6 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'invoices' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}
              >
                الفواتير
              </button>
              <button 
                onClick={() => setActiveTab('quotations')}
                className={`px-6 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'quotations' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}
              >
                عروض الأسعار
              </button>
              <button 
                onClick={() => setActiveTab('contracts')}
                className={`px-6 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'contracts' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}
              >
                العقود
              </button>
            </div>

            <div className="p-6 min-h-[300px]">
              {activeTab === 'projects' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <FolderKanban size={18} className="text-emerald-500" /> المشاريع
                    </h3>
                  </div>
                  {projects.length > 0 ? (
                    <div className="space-y-3">
                      {projects.map((project: any) => (
                        <Link 
                          to={`/projects/${project.id}`} 
                          key={project.id}
                          className="flex items-center justify-between p-4 rounded-xl border border-[hsl(var(--border))] hover:border-emerald-300 hover:shadow-sm transition-all group"
                        >
                          <div>
                            <div className="font-semibold text-sm group-hover:text-emerald-600 transition-colors mb-1">{project.name}</div>
                            <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted))]">
                              <span>التقدم: {project.progress_percent || 0}%</span>
                              <span>•</span>
                              <span className={(project.health_score || 0) < 60 ? 'text-red-500' : 'text-emerald-500'}>
                                الصحة: {project.health_score || 100}%
                              </span>
                            </div>
                          </div>
                          <div className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))]">
                            {project.status === 'completed' ? 'مكتمل' : 'جارٍ التنفيذ'}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[hsl(var(--muted))] border border-dashed border-[hsl(var(--border))] rounded-xl">
                      لا توجد مشاريع مرتبطة بهذا العميل
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <FileText size={18} className="text-green-500" /> الفواتير
                    </h3>
                  </div>
                  {(client.invoices && client.invoices.length > 0) ? (
                    <div className="space-y-3">
                       {client.invoices.map((inv: any) => (
                         <Link to={`/invoices/${inv.id}`} key={inv.id} className="flex items-center justify-between p-4 rounded-xl border border-[hsl(var(--border))] hover:border-green-300 hover:shadow-sm transition-all group">
                            <div className="font-semibold text-sm group-hover:text-green-600 transition-colors">{inv.invoice_number || 'فاتورة #' + inv.id}</div>
                            <div className="text-xs font-semibold text-green-600 dark:text-green-400">{Number(inv.total).toLocaleString('ar-AE')} د.إ</div>
                         </Link>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[hsl(var(--muted))] border border-dashed border-[hsl(var(--border))] rounded-xl">
                      لا توجد فواتير مسجلة لهذا العميل
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'quotations' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <FileText size={18} className="text-emerald-500" /> عروض الأسعار
                    </h3>
                  </div>
                  {(client.quotations && client.quotations.length > 0) ? (
                    <div className="space-y-3">
                       {client.quotations.map((q: any) => (
                         <Link to={`/quotations/${q.id}`} key={q.id} className="flex items-center justify-between p-4 rounded-xl border border-[hsl(var(--border))] hover:border-emerald-300 hover:shadow-sm transition-all group">
                            <div className="font-semibold text-sm group-hover:text-emerald-600 transition-colors">{q.quotation_number || q.project_name || 'عرض سعر #' + q.id}</div>
                            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{Number(q.total).toLocaleString('ar-AE')} د.إ</div>
                         </Link>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[hsl(var(--muted))] border border-dashed border-[hsl(var(--border))] rounded-xl">
                      لا توجد عروض أسعار مسجلة لهذا العميل
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'contracts' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <FileText size={18} className="text-amber-500" /> العقود
                    </h3>
                  </div>
                  {(client.contracts && client.contracts.length > 0) ? (
                    <div className="space-y-3">
                       {client.contracts.map((c: any) => (
                         <Link to={`/contracts/${c.id}`} key={c.id} className="flex items-center justify-between p-4 rounded-xl border border-[hsl(var(--border))] hover:border-amber-300 hover:shadow-sm transition-all group">
                            <div className="font-semibold text-sm group-hover:text-amber-600 transition-colors">{c.title || 'عقد #' + c.id}</div>
                         </Link>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[hsl(var(--muted))] border border-dashed border-[hsl(var(--border))] rounded-xl">
                      لا توجد عقود مسجلة لهذا العميل
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function FolderKanban(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="M8 10v4" />
      <path d="M12 10v2" />
      <path d="M16 10v6" />
    </svg>
  )
}
