import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Receipt, Plus, Search, AlertCircle, CheckCircle2 } from 'lucide-react'
import InvoiceFormModal from '../components/InvoiceFormModal'

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  unpaid: { label: 'غير مدفوعة', badge: 'badge-danger' },
  paid: { label: 'مدفوعة', badge: 'badge-success' },
  partially_paid: { label: 'مدفوعة جزئياً', badge: 'badge-warning' },
  overdue: { label: 'متأخرة', badge: 'bg-red-500 text-white border-transparent' },
  draft: { label: 'مسودة', badge: 'badge-gray' },
  sent: { label: 'مرسلة', badge: 'badge-info' },
}

export default function InvoicesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['invoices', search, status],
    queryFn: () =>
      api.get('/invoices', {
        params: { per_page: 50, search: search || undefined, status: status || undefined }
      }).then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/invoices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    }
  })

  const invoices = data?.data ?? []

  // Stats calculation
  const totalAmount = invoices.reduce((s: number, i: any) => s + Number(i.total), 0)
  const paidAmount = invoices.reduce((s: number, i: any) => s + (i.status === 'paid' ? Number(i.total) : 0), 0)
  const unpaidAmount = invoices.reduce((s: number, i: any) => s + (i.status === 'unpaid' ? Number(i.total) : 0), 0)

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">الفواتير الضريبية</h2>
          <p className="text-[hsl(var(--muted))] mt-1">إدارة الفواتير والمدفوعات</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary shadow-lg shadow-emerald-500/20">
          <Plus size={18} /> فاتورة جديدة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 border-b-4 border-emerald-500">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[hsl(var(--muted))] font-medium text-sm">إجمالي الفواتير</div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Receipt size={18} /></div>
          </div>
          <div className="text-2xl font-black">{totalAmount.toLocaleString('ar-AE')} <span className="text-sm font-normal text-[hsl(var(--muted))]">د.إ</span></div>
          <div className="text-xs text-[hsl(var(--muted))] mt-2">{invoices.length} فاتورة مسجلة</div>
        </div>
        
        <div className="glass-card p-5 border-b-4 border-emerald-500">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[hsl(var(--muted))] font-medium text-sm">المبالغ المحصلة</div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle2 size={18} /></div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{paidAmount.toLocaleString('ar-AE')} <span className="text-sm font-normal text-emerald-600/60">د.إ</span></div>
        </div>

        <div className="glass-card p-5 border-b-4 border-red-500">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[hsl(var(--muted))] font-medium text-sm">المبالغ غير المحصلة</div>
            <div className="p-2 bg-red-50 rounded-lg text-red-600"><AlertCircle size={18} /></div>
          </div>
          <div className="text-2xl font-black text-red-600">{unpaidAmount.toLocaleString('ar-AE')} <span className="text-sm font-normal text-red-600/60">د.إ</span></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute top-1/2 -translate-y-1/2 start-3 text-[hsl(var(--muted))]" />
          <input 
            type="text" 
            placeholder="البحث برقم الفاتورة..." 
            value={search}
            onChange={e => setSearch(e.target.value)} 
            className="form-input ps-10 h-11 w-full" 
          />
        </div>
        <select 
          value={status} 
          onChange={e => setStatus(e.target.value)} 
          className="form-input h-11 min-w-[150px]"
        >
          <option value="">جميع الحالات</option>
          <option value="unpaid">غير مدفوعة</option>
          <option value="paid">مدفوعة</option>
          <option value="draft">مسودة</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-[hsl(var(--border))] animate-pulse rounded-xl" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-start">رقم الفاتورة</th>
                  <th className="text-start">العميل</th>
                  <th className="text-start">تاريخ الإصدار</th>
                  <th className="text-start">تاريخ الاستحقاق</th>
                  <th className="text-start">القيمة الإجمالية</th>
                  <th className="text-start">الحالة</th>
                  <th className="text-end">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv: any) => {
                  const st = STATUS_MAP[inv.status] ?? { label: inv.status, badge: 'badge-gray' }
                  return (
                    <tr key={inv.id} onClick={() => navigate(`/invoices/${inv.id}`)} className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                      <td>
                        <span className="font-mono text-xs text-emerald-600">{inv.invoice_number}</span>
                      </td>
                      <td>
                        <div className="text-sm font-semibold">{inv.client?.company_name || inv.client?.name}</div>
                      </td>
                      <td className="text-xs text-[hsl(var(--muted))]">
                        {inv.issue_date ? new Date(inv.issue_date).toLocaleDateString('ar-AE') : '—'}
                      </td>
                      <td className="text-xs">
                        <span className={`px-2 py-1 rounded-md ${new Date(inv.due_date) < new Date() && inv.status !== 'paid' ? 'bg-red-50 text-red-600 font-medium' : 'text-[hsl(var(--muted))]'}`}>
                          {inv.due_date ? new Date(inv.due_date).toLocaleDateString('ar-AE') : '—'}
                        </span>
                      </td>
                      <td>
                        <div className="font-bold text-sm">
                          {Number(inv.total).toLocaleString('ar-AE')} <span className="text-xs text-[hsl(var(--muted))] font-normal">د.إ</span>
                        </div>
                      </td>
                      <td>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${st.badge}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="text-end" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingInvoice(inv)
                              setIsModalOpen(true)
                            }}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('هل أنت متأكد من حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء.')) {
                                deleteMutation.mutate(inv.id)
                              }
                            }}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && invoices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[hsl(var(--muted))]">
            <Receipt size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-500">لا توجد فواتير</p>
            <p className="text-sm">لم يتم العثور على أي فواتير مطابقة للبحث</p>
          </div>
        )}
      </div>

      <InvoiceFormModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setEditingInvoice(null)
        }}
        invoiceToEdit={editingInvoice}
      />
    </div>
  )
}
