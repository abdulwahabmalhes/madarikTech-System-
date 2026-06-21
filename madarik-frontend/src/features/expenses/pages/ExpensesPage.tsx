import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '@/lib/api'
import { TrendingDown, Plus, Search, Tag } from 'lucide-react'

const CATEGORIES = [
  'رواتب', 'إيجار', 'اتصالات', 'سفر وتنقل', 'مستلزمات مكتبية',
  'تسويق', 'برمجيات', 'أجهزة', 'خدمات خارجية', 'أخرى'
]

export default function ExpensesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', amount: '', category: 'أخرى', date: new Date().toISOString().split('T')[0], notes: '', project_id: '' })

  const { data: projectsData } = useQuery({
    queryKey: ['projects-list'],
    queryFn: () => api.get('/projects?per_page=100').then(r => r.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['expenses', search],
    queryFn: () =>
      api.get('/expenses', { params: { per_page: 50, search: search || undefined } }).then(r => r.data),
  })

  const addMutation = useMutation({
    mutationFn: (data: any) => api.post('/expenses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      setShowAdd(false)
      setForm({ title: '', amount: '', category: 'أخرى', date: new Date().toISOString().split('T')[0], notes: '', project_id: '' })
    },
  })

  const expenses = data?.data ?? []

  const byCategory = expenses.reduce((acc: Record<string, number>, e: any) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
    return acc
  }, {})

  const totalThisMonth = expenses
    .filter((e: any) => {
      const d = new Date(e.date)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((s: number, e: any) => s + Number(e.amount), 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">المصروفات</h2>
          <p className="text-sm text-[hsl(var(--muted))]">
            هذا الشهر: <strong className="text-red-500">{totalThisMonth.toLocaleString('ar-AE')} د.إ</strong>
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={16} /> إضافة مصروف
        </button>
      </div>

      {/* Quick Add Form */}
      {showAdd && (
        <div className="glass-card p-5 border-s-4 border-red-400">
          <h3 className="font-semibold mb-4 text-[hsl(var(--foreground))]">إضافة مصروف جديد</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input placeholder="العنوان" value={form.title}
              onChange={e => setForm({...form, title: e.target.value})} className="form-input" />
            <input type="number" placeholder="المبلغ (د.إ)" value={form.amount}
              onChange={e => setForm({...form, amount: e.target.value})} className="form-input" />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="form-input">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={form.date}
              onChange={e => setForm({...form, date: e.target.value})} className="form-input" />
            <select value={form.project_id} onChange={e => setForm({...form, project_id: e.target.value})} className="form-input">
              <option value="">بدون مشروع</option>
              {projectsData?.data?.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input placeholder="ملاحظات (اختياري)" value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})} className="form-input" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addMutation.mutate({ ...form, project_id: form.project_id || null })}
              disabled={!form.title || !form.amount || addMutation.isPending}
              className="btn-primary"
            >
              {addMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ المصروف'}
            </button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">إلغاء</button>
          </div>
        </div>
      )}

      {/* Category Summary */}
      {Object.keys(byCategory).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(byCategory).slice(0, 4).map(([cat, val]) => (
            <div key={cat} className="glass-card p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Tag size={12} className="text-[hsl(var(--muted))]" />
                <span className="text-xs text-[hsl(var(--muted))]">{cat}</span>
              </div>
              <div className="font-bold text-[hsl(var(--foreground))]">{(val as number).toLocaleString('ar-AE')} <span className="text-xs font-normal text-[hsl(var(--muted))]">د.إ</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="relative max-w-sm">
        <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[hsl(var(--muted))]" />
        <input type="text" placeholder="البحث..." value={search}
          onChange={e => setSearch(e.target.value)} className="form-input ps-9 h-9 py-2" />
      </div>

      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-[hsl(var(--border))] animate-pulse rounded-lg" />)}
          </div>
        ) : (
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-start">العنوان</th>
                <th className="text-start">المشروع</th>
                <th className="text-start">الفئة</th>
                <th className="text-start">التاريخ</th>
                <th className="text-start">المبلغ</th>
                <th className="text-start">ملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e: any) => (
                <tr key={e.id}>
                  <td className="font-medium text-sm">{e.title}</td>
                  <td className="text-xs font-medium text-emerald-600">{e.project?.name || '—'}</td>
                  <td>
                    <span className="badge-gray text-xs px-2 py-0.5 rounded-full">{e.category}</span>
                  </td>
                  <td className="text-xs text-[hsl(var(--muted))]">
                    {e.date ? new Date(e.date).toLocaleDateString('ar-AE') : '—'}
                  </td>
                  <td className="font-semibold text-red-600 text-sm">
                    {Number(e.amount).toLocaleString('ar-AE')} <span className="text-xs font-normal text-[hsl(var(--muted))]">د.إ</span>
                  </td>
                  <td className="text-xs text-[hsl(var(--muted))] max-w-48 truncate">{e.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!isLoading && expenses.length === 0 && (
          <div className="text-center py-12 text-[hsl(var(--muted))]">
            <TrendingDown size={36} className="mx-auto mb-2 opacity-30" />
            لا توجد مصروفات مسجّلة
          </div>
        )}
      </div>
    </div>
  )
}
