import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { FileSignature, Plus, Search, Calendar } from 'lucide-react'

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  draft:     { label: 'مسودة',  badge: 'badge-gray' },
  active:    { label: 'نشط',   badge: 'badge-success' },
  completed: { label: 'منتهي', badge: 'badge-info' },
  cancelled: { label: 'ملغي', badge: 'badge-danger' },
}

export default function ContractsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['contracts', search],
    queryFn: () =>
      api.get('/contracts', {
        params: { per_page: 50, search: search || undefined }
      }).then(r => r.data),
  })

  const contracts = data?.data ?? []
  const totalValue = contracts.reduce((s: number, c: any) => s + Number(c.value || 0), 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">العقود</h2>
          <p className="text-sm text-[hsl(var(--muted))]">
            {contracts.length} عقد •  قيمة إجمالية: {totalValue.toLocaleString('ar-AE')} د.إ
          </p>
        </div>
        <button className="btn-primary"><Plus size={16} /> عقد جديد</button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[hsl(var(--muted))]" />
        <input type="text" placeholder="البحث في العقود..." value={search}
          onChange={e => setSearch(e.target.value)} className="form-input ps-9 h-9 py-2" />
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-[hsl(var(--border))] animate-pulse rounded-lg" />)}
          </div>
        ) : (
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-start">رقم العقد</th>
                <th className="text-start">العميل</th>
                <th className="text-start">المشروع</th>
                <th className="text-start">تاريخ البدء</th>
                <th className="text-start">تاريخ الانتهاء</th>
                <th className="text-start">القيمة</th>
                <th className="text-start">الحالة</th>
                <th className="text-start">التوقيع</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c: any) => {
                const st = STATUS_MAP[c.status] ?? { label: c.status, badge: 'badge-gray' }
                return (
                  <tr key={c.id} onClick={() => navigate(`/contracts/${c.id}`)} className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <td><span className="font-mono text-xs text-emerald-600">{c.contract_number}</span></td>
                    <td><div className="text-sm font-medium">{c.client?.company_name || c.client?.name}</div></td>
                    <td className="text-xs text-[hsl(var(--muted))] max-w-40 truncate">{c.project?.name ?? '—'}</td>
                    <td className="text-xs text-[hsl(var(--muted))]">
                      {c.start_date ? new Date(c.start_date).toLocaleDateString('ar-AE') : '—'}
                    </td>
                    <td className="text-xs text-[hsl(var(--muted))]">
                      {c.end_date ? new Date(c.end_date).toLocaleDateString('ar-AE') : '—'}
                    </td>
                    <td className="font-semibold text-sm">
                      {Number(c.value).toLocaleString('ar-AE')} <span className="text-xs text-[hsl(var(--muted))]">د.إ</span>
                    </td>
                    <td><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.badge}`}>{st.label}</span></td>
                    <td>
                      {c.signed_by_client
                        ? <span className="badge-success text-xs px-2 py-0.5 rounded-full">موقّع ✓</span>
                        : <span className="badge-warning text-xs px-2 py-0.5 rounded-full">بانتظار التوقيع</span>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        {!isLoading && contracts.length === 0 && (
          <div className="text-center py-12 text-[hsl(var(--muted))]">لا توجد عقود</div>
        )}
      </div>
    </div>
  )
}
