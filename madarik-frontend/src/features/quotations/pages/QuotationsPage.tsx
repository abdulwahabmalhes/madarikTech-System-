import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/lib/api'
import { FileText, Plus, Search, Send, Eye, Download, Edit, Trash2 } from 'lucide-react'
import { QuotationFormModal } from '../components/QuotationFormModal'

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  draft:        { label: 'مسودة',        badge: 'badge-gray' },
  sent:         { label: 'مُرسل',        badge: 'badge-info' },
  'under-review': { label: 'قيد المراجعة', badge: 'badge-warning' },
  accepted:     { label: 'مقبول',        badge: 'badge-success' },
  rejected:     { label: 'مرفوض',       badge: 'badge-danger' },
  expired:      { label: 'منتهي',        badge: 'badge-gray' },
}

export default function QuotationsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editQuotation, setEditQuotation] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['quotations', search, status],
    queryFn: () =>
      api.get('/quotations', {
        params: { per_page: 50, search: search || undefined, status: status || undefined }
      }).then(r => r.data),
  })

  const sendMutation = useMutation({
    mutationFn: (id: number) => api.post(`/quotations/${id}/send`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quotations'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/quotations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      alert('تم حذف عرض السعر بنجاح')
    }
  })

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف عرض السعر هذا نهائياً؟')) {
      deleteMutation.mutate(id)
    }
  }

  const handleEdit = (q: any) => {
    // Need to fetch full quotation with items to edit
    api.get(`/quotations/${q.id}`).then(r => {
      setEditQuotation(r.data)
      setIsModalOpen(true)
    })
  }

  const quotations = data?.data ?? []

  const totalValue = quotations
    .filter((q: any) => q.status === 'accepted')
    .reduce((sum: number, q: any) => sum + Number(q.total), 0)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">عروض الأسعار</h2>
          <p className="text-sm text-[hsl(var(--muted))]">{quotations.length} عرض</p>
        </div>
        <button onClick={() => { setEditQuotation(null); setIsModalOpen(true); }} className="btn-primary"><Plus size={16} /> عرض سعر جديد</button>
      </div>

      {isModalOpen && <QuotationFormModal quotation={editQuotation} isEditing={!!editQuotation} onClose={() => setIsModalOpen(false)} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(STATUS_MAP).slice(0, 4).map(([key, val]) => (
          <div
            key={key}
            onClick={() => setStatus(status === key ? '' : key)}
            className={`glass-card p-4 cursor-pointer transition-all ${status === key ? 'ring-2 ring-emerald-500' : 'hover:shadow-md'}`}
          >
            <div className="text-xl font-bold text-[hsl(var(--foreground))]">
              {quotations.filter((q: any) => q.status === key).length}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${val.badge}`}>{val.label}</span>
          </div>
        ))}
      </div>

      {/* Accepted Total */}
      {totalValue > 0 && (
        <div className="glass-card p-4 bg-emerald-50 dark:bg-emerald-950/20 border-s-4 border-emerald-500">
          <div className="text-sm text-emerald-700 dark:text-emerald-400">
            إجمالي العروض المقبولة: <strong>{totalValue.toLocaleString('ar-AE')} د.إ</strong>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[hsl(var(--muted))]" />
          <input
            type="text" placeholder="البحث..." value={search}
            onChange={e => setSearch(e.target.value)} className="form-input ps-9 h-9 py-2"
          />
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)} className="form-input h-9 py-2 w-40">
          <option value="">كل الحالات</option>
          {Object.entries(STATUS_MAP).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-[hsl(var(--border))] animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-start">رقم العرض</th>
                <th className="text-start">العميل</th>
                <th className="text-start">الخدمة / المشروع</th>
                <th className="text-start">التاريخ</th>
                <th className="text-start">الإجمالي</th>
                <th className="text-start">الحالة</th>
                <th className="text-end">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q: any) => {
                const st = STATUS_MAP[q.status] ?? { label: q.status, badge: 'badge-gray' }
                const isExpired = q.expiry_date && new Date(q.expiry_date) < new Date() && q.status === 'sent'
                return (
                  <tr key={q.id}>
                    <td>
                      <Link to={`/quotations/${q.id}`} className="font-mono text-emerald-600 hover:underline text-xs font-bold">
                        {q.quotation_number}
                      </Link>
                    </td>
                    <td>
                      <div className="text-sm font-medium text-[hsl(var(--foreground))]">
                        {q.client?.company_name || q.client?.name}
                      </div>
                    </td>
                    <td className="text-xs text-[hsl(var(--muted))] max-w-36 truncate">{q.project_name}</td>
                    <td className="text-xs text-[hsl(var(--muted))]">
                      {q.issue_date ? new Date(q.issue_date).toLocaleDateString('ar-AE') : '—'}
                    </td>
                    <td className="font-semibold text-sm">
                      {Number(q.total).toLocaleString('ar-AE')} <span className="text-xs text-[hsl(var(--muted))]">د.إ</span>
                    </td>
                    <td>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isExpired ? 'badge-danger' : st.badge}`}>
                        {isExpired ? 'منتهي الصلاحية' : st.label}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1 justify-end">
                        <Link to={`/quotations/${q.id}`}
                          className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-emerald-600 transition-colors"
                          title="عرض التفاصيل / طباعة">
                          <Eye size={16} />
                        </Link>
                        <button
                          onClick={() => handleEdit(q)}
                          className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-amber-500 transition-colors"
                          title="تعديل">
                          <Edit size={16} />
                        </button>
                        {q.status === 'draft' && (
                          <button
                            onClick={() => sendMutation.mutate(q.id)}
                            className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-emerald-600 transition-colors"
                            title="إرسال"
                          >
                            <Send size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-red-500 transition-colors"
                          title="حذف">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        {!isLoading && quotations.length === 0 && (
          <div className="text-center py-12 text-[hsl(var(--muted))]">لا توجد عروض أسعار</div>
        )}
      </div>
    </div>
  )
}
