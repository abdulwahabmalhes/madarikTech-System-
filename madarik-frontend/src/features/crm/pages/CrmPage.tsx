import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '@/lib/api'
import { Plus, Phone, MessageCircle, ChevronDown, Filter } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'

const STAGES = [
  { key: 'new',               label: 'جديد',           color: 'bg-slate-100 dark:bg-slate-800', badge: 'badge-gray' },
  { key: 'contacted',         label: 'تم التواصل',     color: 'bg-emerald-50 dark:bg-emerald-950',   badge: 'badge-info' },
  { key: 'follow-up',         label: 'متابعة',         color: 'bg-amber-50 dark:bg-amber-950', badge: 'badge-warning' },
  { key: 'meeting-scheduled', label: 'اجتماع مجدول',  color: 'bg-purple-50 dark:bg-purple-950', badge: 'badge-purple' },
  { key: 'proposal-sent',     label: 'عرض مُرسل',     color: 'bg-green-50 dark:bg-green-950', badge: 'badge-purple' },
  { key: 'negotiation',       label: 'تفاوض',         color: 'bg-orange-50 dark:bg-orange-950', badge: 'badge-warning' },
  { key: 'won',               label: '✅ تم الفوز',   color: 'bg-emerald-50 dark:bg-emerald-950', badge: 'badge-success' },
  { key: 'lost',              label: '❌ خسارة',      color: 'bg-red-50 dark:bg-red-950', badge: 'badge-danger' },
]

const PRIORITY_COLORS: Record<string, string> = {
  high: 'border-red-400', normal: 'border-emerald-300', low: 'border-gray-200'
}

import { useNavigate } from 'react-router-dom'

function LeadCard({ lead, onStageChange }: { lead: any, onStageChange: (id: number, stage: string) => void }) {
  const navigate = useNavigate()
  const priorityColor = PRIORITY_COLORS[lead.priority] || PRIORITY_COLORS['normal']
  return (
    <div 
      onClick={() => navigate(`/crm/leads/${lead.id}`)}
      className={`bg-white dark:bg-slate-900 rounded-xl p-3 mb-2 shadow-sm border-s-4 ${priorityColor} hover:shadow-md transition-all cursor-pointer`}
    >
      {/* Name */}
      <div className="font-semibold text-sm text-[hsl(var(--foreground))] mb-1 truncate">{lead.name}</div>
      {lead.company_name && (
        <div className="text-xs text-[hsl(var(--muted))] mb-2 truncate">{lead.company_name}</div>
      )}

      {/* Source */}
      <div className="flex items-center gap-1 mb-2">
        <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-0.5 rounded-full">
          {lead.source}
        </span>
      </div>

      {/* Value */}
      {lead.estimated_value && (
        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
          {Number(lead.estimated_value).toLocaleString('ar-AE')} د.إ
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[hsl(var(--border))]">
        <div className="flex gap-1">
          <a
            href={`tel:${lead.mobile}`}
            className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] hover:text-emerald-600 transition-colors"
            title="اتصال"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone size={13} />
          </a>
          <a
            href={`https://wa.me/${lead.whatsapp?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] hover:text-emerald-600 transition-colors"
            title="واتساب"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle size={13} />
          </a>
        </div>
        <div className="relative group">
          <button className="text-xs text-[hsl(var(--muted))] flex items-center gap-1 hover:text-[hsl(var(--foreground))]">
            نقل <ChevronDown size={11} />
          </button>
          <div className="absolute end-0 top-5 z-10 bg-white dark:bg-slate-800 border border-[hsl(var(--border))] rounded-xl shadow-xl py-1 w-40 hidden group-hover:block">
            {STAGES.filter(s => s.key !== lead.stage).map(s => (
              <button
                key={s.key}
                onClick={(e) => { e.stopPropagation(); onStageChange(lead.id, s.key) }}
                className="block w-full text-start px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CrmPage() {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', company_name: '', mobile: '', source: '', estimated_value: '', priority: 'normal', stage: 'new' })

  const { data, isLoading } = useQuery({
    queryKey: ['leads', filter],
    queryFn: () => api.get('/leads', { params: { per_page: 100, search: filter || undefined } }).then(r => r.data),
  })

  const stageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: number; stage: string }) =>
      api.put(`/leads/${id}`, { stage }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  })

  const addMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/leads', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      setShowAdd(false)
      setForm({ name: '', company_name: '', mobile: '', source: '', estimated_value: '', priority: 'normal', stage: 'new' })
    }
  })

  const leads = data?.data ?? []

  const getStageLeads = (stage: string) =>
    leads.filter((l: any) => l.stage === stage)

  const getStagePipelineValue = (stage: string) =>
    getStageLeads(stage).reduce((sum: number, l: any) => sum + (Number(l.estimated_value) || 0), 0)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-[hsl(var(--foreground))]">لوحة العملاء المحتملين</h2>
          <p className="text-sm text-[hsl(var(--muted))]">
            {leads.length} عميل محتمل • {leads.filter((l: any) => !['won','lost'].includes(l.stage)).length} نشط
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="البحث..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="form-input w-48 h-9 py-2"
          />
          <button className="btn-primary h-9 text-xs" onClick={() => setShowAdd(true)}>
            <Plus size={15} /> إضافة عميل
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.slice(0, 5).map(s => (
            <div key={s.key} className="w-64 flex-shrink-0">
              <div className="h-8 bg-[hsl(var(--border))] animate-pulse rounded-lg mb-3" />
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-28 bg-[hsl(var(--border))] animate-pulse rounded-xl mb-2" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageLeads = getStageLeads(stage.key)
            const pipelineVal = getStagePipelineValue(stage.key)
            return (
              <div key={stage.key} className={`flex-shrink-0 w-64 rounded-xl p-3 ${stage.color}`}>
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stage.badge}`}>
                      {stage.label}
                    </span>
                  </div>
                  <span className="text-xs text-[hsl(var(--muted))] bg-white/50 dark:bg-white/10 px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>
                {pipelineVal > 0 && (
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 mb-2 font-medium">
                    {pipelineVal.toLocaleString('ar-AE')} د.إ
                  </div>
                )}

                {/* Cards */}
                <div className="space-y-2 min-h-20">
                  {stageLeads.map((lead: any) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onStageChange={(id, stage) => stageMutation.mutate({ id, stage })}
                    />
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="text-center text-xs text-[hsl(var(--muted-foreground))] py-6">
                      لا يوجد عملاء
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="إضافة عميل محتمل جديد">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">اسم العميل</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" placeholder="اسم العميل" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">الشركة</label>
            <input value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} className="form-input" placeholder="اسم الشركة" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">رقم الجوال</label>
            <input value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="form-input" dir="ltr" placeholder="+971..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">المصدر</label>
            <input value={form.source} onChange={e => setForm({...form, source: e.target.value})} className="form-input" placeholder="مثال: Google Ads" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">القيمة المتوقعة (د.إ)</label>
            <input type="number" value={form.estimated_value} onChange={e => setForm({...form, estimated_value: e.target.value})} className="form-input" placeholder="0" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">الأولوية</label>
            <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="form-input">
              <option value="low">منخفضة</option>
              <option value="normal">عادية</option>
              <option value="high">عالية</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button className="btn-secondary" onClick={() => setShowAdd(false)}>إلغاء</button>
            <button 
              className="btn-primary" 
              onClick={() => addMutation.mutate(form)}
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
