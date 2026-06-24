import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import api from '@/lib/api'
import { ChevronRight, Printer, Send, CheckCircle2, FileSignature, Receipt, Edit, Trash2 } from 'lucide-react'
import { ContractFormModal } from '../components/ContractFormModal'

const STATUS_MAP: any = {
  draft: { label: 'مسودة', badge: 'bg-gray-100 text-gray-700' },
  active: { label: 'نشط', badge: 'bg-emerald-100 text-emerald-700' },
  completed: { label: 'منتهي', badge: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'ملغي', badge: 'bg-red-100 text-red-700' },
}

export default function ContractDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { data: contract, isLoading: isLoadingContract } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => api.get(`/contracts/${id}`).then(r => r.data),
  })

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data)
  })

  const actionMutation = useMutation({
    mutationFn: (action: string) => api.post(`/contracts/${id}/${action}`).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
    }
  })

  const invoiceMutation = useMutation({
    mutationFn: (data: { amount_type: 'full' | 'partial', amount?: number }) => 
      api.post(`/contracts/${id}/convert-to-invoice`, data).then(r => r.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
      if (data.invoice_id) navigate(`/invoices/${data.invoice_id}`)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/contracts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      navigate('/contracts')
    }
  })

  if (isLoadingContract || !contract) {
    return <div className="p-8 text-center text-gray-500">جاري تحميل العقد...</div>
  }

  const s = settingsData || {}
  const status = STATUS_MAP[contract.status] || STATUS_MAP.draft
  
  const getImageUrl = (path: string | undefined) => {
    const finalPath = path || s.logo_path || s.logo
    if (!finalPath) return ''
    if (finalPath.startsWith('http')) return finalPath
    return finalPath.startsWith('/') ? finalPath : '/' + finalPath
  }

  const parseArray = (str: string | any) => {
    if (!str) return []
    if (Array.isArray(str)) return str
    try { return JSON.parse(str) } catch(e) { return [] }
  }

  const paymentSchedule = parseArray(contract.payment_schedule)

  function PageHeader() {
    return (
      <div className="px-12 py-8 flex justify-between items-center border-b border-gray-100">
        {(s.logo_path || s.logo) ? (
          <img src={getImageUrl(s.logo_path || s.logo)} alt="Logo" className="h-12 object-contain" />
        ) : (
          <div className="font-black text-2xl text-emerald-600">{s.company_name_ar || s.company_name_en || s.company_name || 'الشركة'}</div>
        )}
        <div className="text-end">
          <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">Contract</div>
          <div className="font-bold text-gray-800">عقد اتفاق رسمي</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 no-print">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/contracts')} className="p-2 bg-[hsl(var(--surface))] rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors">
            <ChevronRight size={18} />
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileSignature size={20} className="text-emerald-500" />
            عقد رقم {contract.contract_number}
          </h2>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${status.badge}`}>
            {status.label}
          </span>
        </div>
        
        <div className="flex gap-2">
          {contract.status === 'draft' && (
            <button onClick={() => actionMutation.mutate('sign')} disabled={actionMutation.isPending} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
              <CheckCircle2 size={16} /> توقيع العقد
            </button>
          )}
          
          {(contract.status === 'active' || contract.status === 'draft') && (
            <div className="flex gap-2 bg-emerald-50 p-1 rounded-xl border border-emerald-100">
              <button onClick={() => {
                if(confirm('سيتم إنشاء فاتورة بكامل مبلغ العقد. هل أنت متأكد؟')) {
                  invoiceMutation.mutate({ amount_type: 'full' })
                }
              }} disabled={invoiceMutation.isPending} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-1">
                <Receipt size={14} /> فاتورة لكامل المبلغ
              </button>
              <button onClick={() => {
                const amount = prompt('أدخل مبلغ الدفعة الجزئية:')
                if(amount && !isNaN(Number(amount))) {
                  invoiceMutation.mutate({ amount_type: 'partial', amount: Number(amount) })
                }
              }} disabled={invoiceMutation.isPending} className="px-3 py-1.5 bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50 rounded-lg text-sm font-medium transition-all flex items-center gap-1">
                فاتورة دفعة جزئية
              </button>
            </div>
          )}

          <button className="btn-secondary" onClick={() => window.print()}><Printer size={16} /> طباعة / تصدير PDF</button>
          <button className="p-2 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsEditModalOpen(true)} title="تعديل العقد"><Edit size={16} /></button>
          <button className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors" onClick={() => {
            if(confirm('هل أنت متأكد من حذف هذا العقد نهائياً؟')) deleteMutation.mutate()
          }} disabled={deleteMutation.isPending} title="حذف العقد"><Trash2 size={16} /></button>
        </div>
      </div>

      {/* Printable Area - A4 Size simulated pages */}
      <div className="printable-container mx-auto">
        
        {/* --- PAGE 1: COVER --- */}
        <div className="a4-page cover-page flex flex-col items-center justify-center relative bg-emerald-900 overflow-hidden text-white">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="absolute -right-32 -top-32 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          
          <div className="z-10 text-center w-full px-12">
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 inline-block mb-16 shadow-2xl">
              {(s.logo_path || s.logo) ? (
                <img src={getImageUrl(s.logo_path || s.logo)} alt="Logo" className="h-28 mx-auto object-contain filter drop-shadow-lg" />
              ) : (
                <h1 className="text-4xl font-black">{s.company_name_ar || s.company_name_en || s.company_name || 'الشركة'}</h1>
              )}
            </div>
            
            <div className="text-emerald-300 font-bold tracking-[0.3em] uppercase text-sm mb-4">Agreement Contract</div>
            <div className="h-1.5 w-32 bg-emerald-400 mx-auto mb-10 rounded-full"></div>
            
            <h3 className="text-2xl md:text-4xl font-bold mb-4 text-emerald-50">{contract.title}</h3>
            
            <div className="mt-24 p-8 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10 max-w-xl mx-auto">
              <p className="text-emerald-200 mb-2">مقدم إلى / عناية:</p>
              <p className="text-2xl font-bold text-white">{contract.client?.company_name || contract.client?.name}</p>
            </div>
          </div>
          <div className="absolute bottom-10 left-0 right-0 text-center text-sm font-medium text-emerald-300 tracking-widest">
            {new Date(contract.start_date || new Date()).toLocaleDateString('ar-AE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* --- PAGE 2: CONTENT --- */}
        <div className="a4-page flex flex-col bg-white">
          <PageHeader />
          
          <div className="flex-1 p-12">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-gray-900 mb-4 inline-block border-b-4 border-emerald-500 pb-2">عقد اتفاق</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                <h4 className="font-bold text-gray-500 text-sm mb-4">الطرف الأول (الشركة المنفذة)</h4>
                <div className="font-black text-lg text-gray-900 mb-2">{s.company_name_ar || s.company_name_en || s.company_name || 'الشركة'}</div>
                {s.license_number && <div className="text-gray-600 text-sm mb-1">رقم الرخصة: {s.license_number}</div>}
                {s.address_ar && <div className="text-gray-600 text-sm mb-1">العنوان: {s.address_ar}</div>}
                {s.phone && <div className="text-gray-600 text-sm mb-1" dir="ltr">{s.phone}</div>}
                {s.email && <div className="text-gray-600 text-sm mb-1">{s.email}</div>}
              </div>
              
              <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                <h4 className="font-bold text-gray-500 text-sm mb-4">الطرف الثاني (العميل)</h4>
                <div className="font-black text-lg text-gray-900 mb-2">{contract.client?.company_name || contract.client?.name}</div>
                {contract.client?.company_name && <div className="text-gray-600 text-sm mb-1">عناية السيد: {contract.client?.name}</div>}
                {contract.client?.phone && <div className="text-gray-600 text-sm mb-1" dir="ltr">{contract.client?.phone}</div>}
                {contract.client?.email && <div className="text-gray-600 text-sm mb-1">{contract.client?.email}</div>}
              </div>
            </div>

            {/* Content */}
            {contract.content && (
              <section className="mb-10">
                <div className="text-gray-800 leading-loose text-justify text-[15px] p-6 border border-gray-200 rounded-2xl whitespace-pre-wrap">
                  {contract.content}
                </div>
              </section>
            )}

            {/* Financials */}
            <section className="mb-10">
              <h3 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">2</span>
                التفاصيل المالية
              </h3>
              
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3 mb-6">
                <div className="flex justify-between text-xl font-black text-emerald-600 pt-4">
                  <span>إجمالي قيمة العقد:</span>
                  <span>{Number(contract.value).toLocaleString()} {contract.currency_code || 'د.إ'}</span>
                </div>
              </div>

              {paymentSchedule.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-bold text-gray-800 mb-4">جدول الدفعات:</h4>
                  <div className="grid gap-3">
                    {paymentSchedule.map((pm: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">{pm.percentage}%</div>
                          <div>
                            <div className="font-bold text-gray-800">{pm.milestone}</div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-900">
                          {((Number(contract.value) * Number(pm.percentage)) / 100).toLocaleString()} {contract.currency_code || 'د.إ'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
            
            {/* Signatures */}
            <section className="mt-20">
              <div className="grid grid-cols-2 gap-12">
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-8 border-b pb-2">عن الطرف الأول</div>
                  <div className="font-black text-lg text-emerald-900 mb-1">{s.company_name_ar || s.company_name_en || s.company_name || 'الشركة'}</div>
                  <div className="text-gray-500 text-sm mb-6">الاسم: {s.manager_name || ''}</div>
                  <div className="h-24 border-b-2 border-dashed border-gray-300 w-3/4 mx-auto mb-2 relative">
                    <span className="text-gray-300 text-xs absolute bottom-2 left-1/2 -translate-x-1/2">التوقيع / الختم</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800 mb-8 border-b pb-2">عن الطرف الثاني</div>
                  <div className="font-black text-lg text-gray-900 mb-1">{contract.client?.company_name || contract.client?.name}</div>
                  <div className="text-gray-500 text-sm mb-6">الاسم: {contract.client?.name || ''}</div>
                  <div className="h-24 border-b-2 border-dashed border-gray-300 w-3/4 mx-auto mb-2 relative">
                    <span className="text-gray-300 text-xs absolute bottom-2 left-1/2 -translate-x-1/2">التوقيع / الختم</span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .printable-container, .printable-container * { visibility: visible; }
          .printable-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; background: white; }
          .a4-page { width: 210mm; height: 297mm; min-height: 297mm; margin: 0 auto; page-break-after: always; box-shadow: none !important; border: none !important; border-radius: 0 !important; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0; }
        }
        .a4-page { width: 210mm; min-height: 297mm; margin: 0 auto 2rem auto; background: white; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
      `}} />

      <ContractFormModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} contractToEdit={contract} />
    </div>
  )
}
