import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { 
  Building2, Phone, Mail, MapPin, ChevronRight, User, Target,
  RefreshCw, FileText, Globe, Link as LinkIcon
} from 'lucide-react'

const STAGE_MAP: Record<string, { label: string; badge: string }> = {
  'new':         { label: 'جديد',           badge: 'badge-info' },
  'contacted':   { label: 'تم التواصل',    badge: 'badge-warning' },
  'qualified':   { label: 'مؤهل',           badge: 'badge-purple' },
  'proposal':    { label: 'عرض سعر',        badge: 'badge-gray' },
  'negotiation': { label: 'تفاوض',          badge: 'badge-warning' },
  'won':         { label: 'ربح',            badge: 'badge-success' },
  'lost':        { label: 'خسارة',          badge: 'badge-danger' },
}

export default function LeadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => api.get(`/leads/${id}`).then(r => r.data),
  })

  const convertMutation = useMutation({
    mutationFn: () => api.post(`/leads/${id}/convert`),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] })
      navigate(`/clients/${res.data.client.id}`)
    }
  })

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse text-[hsl(var(--muted))]">جاري تحميل بيانات العميل المحتمل...</div>
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">العميل المحتمل غير موجود</div>
  }

  const lead = data
  const stage = STAGE_MAP[lead.stage] ?? { label: lead.stage, badge: 'badge-gray' }

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/crm/leads')} className="p-2 bg-[hsl(var(--surface))] rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] transition-colors">
            <ChevronRight size={18} />
          </button>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">تفاصيل العميل المحتمل</h2>
        </div>
        
        {lead.stage !== 'won' && lead.stage !== 'lost' && (
          <button 
            onClick={() => convertMutation.mutate()}
            disabled={convertMutation.isPending}
            className="px-4 py-2 bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
          >
            <RefreshCw size={16} className={convertMutation.isPending ? 'animate-spin' : ''} />
            تحويل إلى عميل فعلي
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-t-4 border-t-green-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {lead.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[hsl(var(--foreground))] mb-1">{lead.name}</h3>
                {lead.company_name && (
                  <div className="text-sm text-[hsl(var(--muted))] flex items-center gap-1.5">
                    <Building2 size={14} /> {lead.company_name}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))]">
                <span className="text-xs text-[hsl(var(--muted))]">المرحلة الحالية</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${stage.badge}`}>
                  {stage.label}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted))]">
                <div className="w-8 h-8 rounded-lg bg-[hsl(var(--surface))] flex items-center justify-center text-emerald-500 shrink-0">
                  <Phone size={14} />
                </div>
                <a href={`tel:${lead.mobile}`} className="hover:text-emerald-600 transition-colors" dir="ltr">{lead.mobile}</a>
              </div>
              {lead.email && (
                <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted))]">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--surface))] flex items-center justify-center text-green-500 shrink-0">
                    <Mail size={14} />
                  </div>
                  <a href={`mailto:${lead.email}`} className="hover:text-green-600 transition-colors">{lead.email}</a>
                </div>
              )}
              {lead.country && (
                <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted))]">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(var(--surface))] flex items-center justify-center text-emerald-500 shrink-0">
                    <MapPin size={14} />
                  </div>
                  <span>{lead.country}</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-[hsl(var(--border))]">
              <div className="flex items-center justify-between text-xs text-[hsl(var(--muted))]">
                <span>المصدر</span>
                <span className="font-semibold px-2 py-0.5 bg-[hsl(var(--surface))] rounded-md border border-[hsl(var(--border))]">{lead.source}</span>
              </div>
            </div>
          </div>

          {/* Assigned User */}
          {lead.assigned_user && (
            <div className="glass-card p-5">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <User size={16} className="text-[hsl(var(--muted))]" /> مسؤول المتابعة
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[hsl(var(--muted))]">
                  {lead.assigned_user.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium">{lead.assigned_user.name}</div>
                  <div className="text-xs text-[hsl(var(--muted))]">مبيعات</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-5 border-l-4 border-l-purple-500 rtl:border-r-4 rtl:border-l-0 rtl:border-r-purple-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-[hsl(var(--muted))]">القيمة المتوقعة</h4>
                <div className="p-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg"><Target size={14} /></div>
              </div>
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">
                {lead.estimated_value ? Number(lead.estimated_value).toLocaleString('ar-AE') : '0'} 
                <span className="text-sm font-normal text-[hsl(var(--muted))]"> د.إ</span>
              </div>
            </div>
            <div className="glass-card p-5 border-l-4 border-l-emerald-500 rtl:border-r-4 rtl:border-l-0 rtl:border-r-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-[hsl(var(--muted))]">نسبة الإغلاق المتوقعة</h4>
                <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-lg"><Globe size={14} /></div>
              </div>
              <div className="text-2xl font-bold text-[hsl(var(--foreground))]">
                {lead.stage === 'won' ? '100' : lead.stage === 'lost' ? '0' : '50'}%
              </div>
            </div>
          </div>

          {lead.converted_client && (
            <div className="glass-card p-5 bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-2">
                    <CheckCircle2 size={16} /> تم تحويله إلى عميل بنجاح
                  </h4>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                    هذا السجل مغلق الآن ويمكنك إدارة العميل من ملفه الخاص.
                  </p>
                </div>
                <Link to={`/clients/${lead.converted_client.id}`} className="btn-secondary bg-white dark:bg-slate-900">
                  <LinkIcon size={14} className="me-2" /> عرض العميل
                </Link>
              </div>
            </div>
          )}

          <div className="glass-card p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <FileText size={18} className="text-green-500" /> ملاحظات العميل المحتمل
            </h3>
            
            <div className="p-4 bg-[hsl(var(--surface))] rounded-xl border border-[hsl(var(--border))] min-h-[150px]">
              {lead.notes ? (
                <p className="text-sm leading-relaxed text-[hsl(var(--foreground))] whitespace-pre-wrap">
                  {lead.notes}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[hsl(var(--muted))] opacity-60 space-y-2 py-8">
                  <FileText size={32} />
                  <span>لا توجد ملاحظات مسجلة حالياً</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
