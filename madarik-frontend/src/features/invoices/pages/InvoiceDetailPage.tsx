import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { ChevronRight, Printer, Send, CheckCircle2, Receipt, FileText } from 'lucide-react'

const STATUS_MAP: any = {
  unpaid: { label: 'غير مدفوعة', badge: 'bg-red-100 text-red-700' },
  paid: { label: 'مدفوعة', badge: 'bg-emerald-100 text-emerald-700' },
  partially_paid: { label: 'مدفوعة جزئياً', badge: 'bg-amber-100 text-amber-700' },
  overdue: { label: 'متأخرة', badge: 'bg-red-100 text-red-700 font-bold' },
  draft: { label: 'مسودة', badge: 'bg-gray-100 text-gray-700' },
  sent: { label: 'مرسلة', badge: 'bg-emerald-100 text-emerald-700' },
}

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: invoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => api.get(`/invoices/${id}`).then(r => r.data),
  })

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data)
  })

  const actionMutation = useMutation({
    mutationFn: (action: string) => api.post(`/invoices/${id}/${action}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoice', id] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
    }
  })

  if (isLoadingInvoice || !invoice) {
    return <div className="p-8 text-center text-gray-500">جاري تحميل الفاتورة...</div>
  }

  const s = settingsData || {}
  const status = STATUS_MAP[invoice.status] || STATUS_MAP.unpaid
  
  const getImageUrl = (path: string | undefined) => {
    const finalPath = path || s.logo_path || s.logo
    if (!finalPath) return ''
    if (finalPath.startsWith('http')) return finalPath
    return finalPath.startsWith('/') ? finalPath : '/' + finalPath
  }

  function PageHeader() {
    return (
      <div className="px-12 py-8 flex justify-between items-center border-b border-gray-100">
        <div>
          {(s.logo_path || s.logo) ? (
            <img src={getImageUrl(s.logo_path || s.logo)} alt="Logo" className="h-12 object-contain mb-2" />
          ) : (
            <div className="font-black text-2xl text-emerald-600 mb-2">{s.company_name_ar || s.company_name_en || s.company_name || 'الشركة'}</div>
          )}
          <div className="flex flex-col items-start text-start gap-0.5 mt-2">
            {s.email && <div className="text-gray-500 text-xs font-medium">{s.email}</div>}
            {(s.manager_phone || s.phone) && <div className="text-gray-500 text-xs font-medium" dir="ltr" style={{ textAlign: 'right' }}>{s.manager_phone || s.phone}</div>}
            {s.license_number && <div className="text-gray-500 text-xs font-medium mt-1">رقم الرخصة: {s.license_number}</div>}
          </div>
        </div>
        <div className="text-end">
          <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">Invoice</div>
          <div className="font-bold text-gray-800">فاتورة</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 no-print">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/invoices')} className="p-2 bg-[hsl(var(--surface))] rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors">
            <ChevronRight size={18} />
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Receipt size={20} className="text-emerald-500" />
            فاتورة رقم {invoice.invoice_number}
          </h2>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${status.badge}`}>
            {status.label}
          </span>
        </div>
        
        <div className="flex gap-2">
          {invoice.status !== 'paid' && (
            <button onClick={() => actionMutation.mutate('mark-paid')} disabled={actionMutation.isPending} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
              <CheckCircle2 size={16} /> تحديد كمدفوعة
            </button>
          )}

          <button className="btn-secondary" onClick={() => window.print()}><Printer size={16} /> طباعة / تصدير PDF</button>
        </div>
      </div>

      {/* Printable Area - A4 Size simulated pages */}
      <div className="printable-container mx-auto">
        
        {/* --- PAGE 1: CONTENT --- */}
        <div className="a4-page flex flex-col bg-white relative">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-bl-full mix-blend-multiply filter blur-3xl opacity-10"></div>

          <PageHeader />
          
          <div className="flex-1 p-12">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-gray-900 mb-4 inline-block border-b-4 border-emerald-500 pb-2">فاتورة</h2>
              <div className="text-gray-500 font-medium">فاتورة رقم: {invoice.invoice_number}</div>
            </div>
            
            <div className="flex justify-between mb-10">
              <div className="w-1/2 pe-6">
                <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 h-full">
                  <h4 className="font-bold text-gray-500 text-sm mb-4">فاتورة إلى (العميل)</h4>
                  <div className="font-black text-lg text-gray-900 mb-2">{invoice.client?.company_name || invoice.client?.name}</div>
                  {invoice.client?.company_name && <div className="text-gray-600 text-sm mb-1">عناية السيد: {invoice.client?.name}</div>}
                  {invoice.client?.phone && <div className="text-gray-600 text-sm mb-1" dir="ltr">{invoice.client?.phone}</div>}
                  {invoice.client?.email && <div className="text-gray-600 text-sm mb-1">{invoice.client?.email}</div>}
                </div>
              </div>
              <div className="w-1/2 ps-6">
                <div className="p-6 rounded-2xl border border-gray-100 bg-emerald-50/30 h-full flex flex-col justify-center space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-bold">تاريخ الإصدار:</span>
                    <span className="font-bold text-gray-900">{new Date(invoice.issue_date || new Date()).toLocaleDateString('ar-AE')}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-bold">تاريخ الاستحقاق:</span>
                    <span className="font-bold text-gray-900">{new Date(invoice.due_date || new Date()).toLocaleDateString('ar-AE')}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-500 font-bold">حالة الدفع:</span>
                    <span className={`font-bold ${invoice.status === 'paid' ? 'text-emerald-600' : 'text-red-600'}`}>{status.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-10 rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full text-start">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-4 px-6 text-start text-sm font-bold text-gray-500">الوصف</th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-gray-500 w-24">الكمية</th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-gray-500 w-32">السعر</th>
                    <th className="py-4 px-6 text-end text-sm font-bold text-gray-500 w-32">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.items && invoice.items.length > 0 ? (
                    invoice.items.map((item: any) => (
                      <tr key={item.id}>
                        <td className="py-4 px-6">
                          <div className="font-bold text-gray-900">{item.product?.name || item.description || 'بند غير مسجل'}</div>
                          {item.product && <div className="text-xs text-gray-500 mt-1">{item.description}</div>}
                        </td>
                        <td className="py-4 px-6 text-center font-medium text-gray-700">{item.quantity}</td>
                        <td className="py-4 px-6 text-center font-medium text-gray-700">{Number(item.unit_price).toLocaleString()}</td>
                        <td className="py-4 px-6 text-end font-bold text-gray-900">{Number(item.total).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">لا توجد عناصر في هذه الفاتورة</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-10">
              <div className="w-80 bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold">{Number(invoice.subtotal).toLocaleString()}</span>
                </div>
                {Number(invoice.discount_amount) > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>الخصم:</span>
                    <span className="font-bold">- {Number(invoice.discount_amount).toLocaleString()}</span>
                  </div>
                )}
                {Number(invoice.tax_amount) > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>الضريبة ({invoice.tax_percent}%):</span>
                    <span className="font-bold">{Number(invoice.tax_amount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black text-emerald-600 pt-4 border-t border-gray-200">
                  <span>الإجمالي المستحق:</span>
                  <span>{Number(invoice.total).toLocaleString()} د.إ</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-10 p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-2">ملاحظات:</h4>
                <div className="text-sm text-emerald-800 whitespace-pre-wrap">{invoice.notes}</div>
              </div>
            )}
            
            {/* Terms */}
            {invoice.terms && (
              <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-700 mb-2">الشروط والأحكام:</h4>
                <div className="text-xs text-gray-500 whitespace-pre-wrap">{invoice.terms}</div>
              </div>
            )}

            <div className="mt-16 text-center text-gray-400 text-sm">
              شكراً لتعاملكم معنا!
            </div>
          </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .printable-container, .printable-container * { visibility: visible; }
          .printable-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background: white; }
          .a4-page { width: 210mm; min-height: 297mm; margin: 0 auto; page-break-after: always; box-shadow: none !important; border: none !important; border-radius: 0 !important; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0; }
        }
        .a4-page { width: 210mm; min-height: 297mm; margin: 0 auto 2rem auto; background: white; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
      `}} />
    </div>
  )
}
