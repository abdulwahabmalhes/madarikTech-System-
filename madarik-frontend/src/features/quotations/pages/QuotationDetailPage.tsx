import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { ChevronRight, Printer, Send, CheckCircle2, XCircle, FileText, FileSignature } from 'lucide-react'

const STATUS_MAP: any = {
  draft: { label: 'مسودة', badge: 'bg-gray-100 text-gray-700' },
  sent: { label: 'مرسل', badge: 'bg-emerald-100 text-emerald-700' },
  'under-review': { label: 'قيد المراجعة', badge: 'bg-amber-100 text-amber-800' },
  accepted: { label: 'مقبول', badge: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'مرفوض', badge: 'bg-red-100 text-red-700' },
}

export default function QuotationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: quotation, isLoading: isLoadingQuotation } = useQuery({
    queryKey: ['quotation', id],
    queryFn: () => api.get(`/quotations/${id}`).then(r => r.data),
  })

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data)
  })

  const actionMutation = useMutation({
    mutationFn: (action: string) => api.post(`/quotations/${id}/${action}`).then(r => r.data),
    onSuccess: (data, action) => {
      queryClient.invalidateQueries({ queryKey: ['quotation', id] })
      if (action === 'convert' && data.contract_id) {
        navigate(`/contracts`)
      }
    }
  })

  if (isLoadingQuotation || !quotation) {
    return <div className="p-8 text-center text-gray-500">جاري تحميل عرض السعر...</div>
  }

  const s = settingsData || {}
  
  const getImageUrl = (path: string | undefined) => {
    const finalPath = path || s.logo_path || s.logo
    if (!finalPath) return ''
    if (finalPath.startsWith('http')) return finalPath
    return finalPath.startsWith('/') ? finalPath : '/' + finalPath
  }

  const status = STATUS_MAP[quotation.status] ?? { label: quotation.status, badge: 'bg-gray-100' }
  const items = quotation.items ?? []
  const sections = quotation.sections ?? []
  
  // Safe parsing of JSON arrays from DB if they come back as strings occasionally
  const parseArray = (val: any) => {
    if (!val) return []
    if (Array.isArray(val)) return val
    try { 
      const parsed = typeof val === 'string' ? JSON.parse(val) : val;
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) { return [] }
  }

  const supportIncludes = parseArray(quotation.support_includes)
  const supportExcludes = parseArray(quotation.support_excludes)
  const deliverables = parseArray(quotation.deliverables)
  const uiUxDesign = parseArray(quotation.ui_ux_design)
  const paymentMechanism = parseArray(quotation.payment_mechanism)

  return (
    <div className="space-y-6 pb-20">
      {/* Action Bar (Not Printable) */}
      <div className="flex items-center justify-between flex-wrap gap-4 no-print">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/quotations')} className="p-2 bg-[hsl(var(--surface))] rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors">
            <ChevronRight size={18} />
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText size={20} className="text-emerald-500" />
            عرض سعر {quotation.quotation_number}
          </h2>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${status.badge}`}>
            {status.label}
          </span>
        </div>
        
        <div className="flex gap-2">
          {quotation.status === 'draft' && (
            <button onClick={() => actionMutation.mutate('send')} disabled={actionMutation.isPending} className="btn-primary">
              <Send size={16} /> إرسال للعميل
            </button>
          )}
          {quotation.status === 'sent' && (
            <>
              <button onClick={() => actionMutation.mutate('accept')} disabled={actionMutation.isPending} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                <CheckCircle2 size={16} /> قبول
              </button>
              <button onClick={() => actionMutation.mutate('reject')} disabled={actionMutation.isPending} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
                <XCircle size={16} /> رفض
              </button>
            </>
          )}
          {quotation.status === 'accepted' && (
            <button onClick={() => actionMutation.mutate('convert')} disabled={actionMutation.isPending} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
              <FileSignature size={16} /> تحويل إلى عقد
            </button>
          )}
          <button className="btn-secondary" onClick={() => window.print()}><Printer size={16} /> طباعة / تصدير PDF</button>
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
            
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">عرض سعر فني ومالي</h2>
            <div className="h-1.5 w-32 bg-emerald-400 mx-auto mb-10 rounded-full"></div>
            
            <h3 className="text-2xl md:text-4xl font-bold mb-4 text-emerald-50">{quotation.project_name}</h3>
            {quotation.project_type && (
              <p className="text-xl text-emerald-200 font-medium tracking-wide">{quotation.project_type}</p>
            )}
            
            <div className="mt-24 p-8 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10 max-w-xl mx-auto">
              <p className="text-emerald-200 mb-2">مقدم إلى السيد / الشركة:</p>
              <p className="text-2xl font-bold text-white">{quotation.client?.company_name || quotation.client?.name}</p>
            </div>
          </div>
          <div className="absolute bottom-10 left-0 right-0 text-center text-sm font-medium text-emerald-300 tracking-widest">
            {new Date(quotation.issue_date || new Date()).toLocaleDateString('ar-AE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>


        {/* --- PAGE 2: INTRODUCTION & OVERVIEW --- */}
        <div className="a4-page flex flex-col bg-white">
          <PageHeader s={s} />
          
          <div className="flex-1 px-12 py-10 space-y-12">
            
            {/* Parties */}
            <section>
              <h3 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">1</span>
                أطراف التعاقد
              </h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <h4 className="font-bold text-gray-500 text-sm mb-4">الطرف الأول (الشركة المنفذة)</h4>
                  <div className="font-black text-lg text-gray-900 mb-2">{s.company_name_ar || s.company_name_en || s.company_name || 'الشركة'}</div>
                  {s.license_number && <div className="text-gray-600 text-sm mb-1">رخصة رقم: {s.license_number}</div>}
                  {s.address_ar && <div className="text-gray-600 text-sm mb-1">{s.address_ar}</div>}
                  {s.phone && <div className="text-gray-600 text-sm mb-1" dir="ltr">{s.phone}</div>}
                  {s.email && <div className="text-gray-600 text-sm mb-1">{s.email}</div>}
                </div>
                <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <h4 className="font-bold text-gray-500 text-sm mb-4">الطرف الثاني (العميل)</h4>
                  <div className="font-black text-lg text-gray-900 mb-2">{quotation.client?.company_name || quotation.client?.name}</div>
                  {quotation.client?.company_name && <div className="text-gray-600 text-sm mb-1">عناية السيد: {quotation.client?.name}</div>}
                  {quotation.client?.phone && <div className="text-gray-600 text-sm mb-1" dir="ltr">{quotation.client?.phone}</div>}
                  {quotation.client?.email && <div className="text-gray-600 text-sm mb-1">{quotation.client?.email}</div>}
                </div>
              </div>
            </section>

            {/* Overview */}
            {quotation.project_overview && (
              <section>
                <h3 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">2</span>
                  نبذة عن المشروع (Overview)
                </h3>
                <div className="text-gray-700 leading-loose text-justify text-[15px] p-6 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl whitespace-pre-wrap">
                  {quotation.project_overview}
                </div>
              </section>
            )}

            {/* Goals */}
            {quotation.project_goals && (
              <section>
                <h3 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">3</span>
                  أهداف المشروع (Goals)
                </h3>
                <div className="text-gray-700 leading-loose text-justify text-[15px] p-6 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl whitespace-pre-wrap">
                  {quotation.project_goals}
                </div>
              </section>
            )}

          </div>
          
          <PageFooter s={s} pageNum={2} totalPages={5} />
        </div>

        {/* --- PAGE 3: SCOPE OF WORK --- */}
        <div className="a4-page flex flex-col bg-white">
          <PageHeader s={s} />
          
          <div className="flex-1 px-12 py-10 space-y-10">
            <section>
              <h3 className="text-xl font-black text-emerald-900 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">4</span>
                نطاق العمل (Scope of Work)
              </h3>
              
              <div className="space-y-8">
                {sections.map((sec: any, idx: number) => {
                  const points = parseArray(sec.bullet_points)
                  return (
                    <div key={idx} className="relative pl-6 border-r-4 border-emerald-400 py-2">
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{sec.title}</h4>
                      {sec.description && <p className="text-gray-600 text-sm mb-4">{sec.description}</p>}
                      {points.length > 0 && points[0] !== '' && (
                        <ul className="grid grid-cols-2 gap-y-3 gap-x-8 mt-4">
                          {points.map((pt: string, pIdx: number) => pt && (
                            <li key={pIdx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-emerald-500 font-bold mt-0.5">•</span>
                              <span className="flex-1">{pt}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
            
            {/* UI UX */}
            {uiUxDesign.length > 0 && uiUxDesign[0] !== '' && (
              <section>
                <h3 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">5</span>
                  التصميم وتجربة المستخدم (UI/UX)
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <ul className="grid grid-cols-2 gap-4">
                    {uiUxDesign.map((item: string, i: number) => item && (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

          </div>
          
          <PageFooter s={s} pageNum={3} totalPages={5} />
        </div>

        {/* --- PAGE 4: EXECUTION & SUPPORT --- */}
        <div className="a4-page flex flex-col bg-white">
          <PageHeader s={s} />
          
          <div className="flex-1 px-12 py-10 space-y-12">
            
            {/* Deliverables */}
            {deliverables.length > 0 && deliverables[0] !== '' && (
              <section>
                <h3 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">6</span>
                  مخرجات المشروع (Deliverables)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {deliverables.map((item: string, i: number) => item && (
                    <div key={i} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="font-bold text-emerald-900 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Timeline */}
            <section>
              <h3 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">7</span>
                الجدول الزمني (Timeline)
              </h3>
              <div className="flex items-center justify-around bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="text-center">
                  <div className="text-gray-500 text-sm font-bold mb-2">مدة التنفيذ المتوقعة</div>
                  <div className="text-4xl font-black text-gray-900">{quotation.execution_days || '--'} <span className="text-lg">يوم عمل</span></div>
                </div>
                {quotation.delivery_date && (
                  <>
                    <div className="w-px h-16 bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-gray-500 text-sm font-bold mb-2">تاريخ التسليم المتوقع</div>
                      <div className="text-2xl font-black text-gray-900">{new Date(quotation.delivery_date).toLocaleDateString('ar-AE')}</div>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Support */}
            <section>
              <h3 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">8</span>
                الدعم الفني والضمان (Support & Warranty)
              </h3>
              <div className="bg-white border-2 border-emerald-50 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex justify-between items-center">
                  <span className="font-black text-emerald-900">مدة الضمان والدعم الفني:</span>
                  <span className="font-black text-emerald-700 bg-white px-4 py-1 rounded-full text-sm">{quotation.support_duration || 'سنة كاملة'}</span>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-6 border-l border-gray-100">
                    <h4 className="font-bold text-emerald-600 mb-4 flex items-center gap-2">
                      <CheckCircle2 size={18} /> يشمل الدعم الفني:
                    </h4>
                    <ul className="space-y-3">
                      {supportIncludes.map((item: string, i: number) => item && (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-emerald-400 mt-1">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 bg-gray-50/50">
                    <h4 className="font-bold text-red-500 mb-4 flex items-center gap-2">
                      <XCircle size={18} /> لا يشمل الدعم الفني:
                    </h4>
                    <ul className="space-y-3">
                      {supportExcludes.map((item: string, i: number) => item && (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-red-400 mt-1">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

          </div>
          
          <PageFooter s={s} pageNum={4} totalPages={5} />
        </div>

        {/* --- PAGE 5: FINANCIALS & TERMS --- */}
        <div className="a4-page flex flex-col bg-white">
          <PageHeader s={s} />
          
          <div className="flex-1 px-12 py-10 space-y-12">
            
            <section>
              <h3 className="text-xl font-black text-emerald-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">9</span>
                التكلفة المالية (Financial Cost)
              </h3>
              
              <table className="w-full text-sm border-collapse mb-6">
                <thead>
                  <tr className="bg-emerald-50 text-emerald-900">
                    <th className="py-4 px-4 text-start font-bold rounded-tr-xl">البند / الخدمة</th>
                    <th className="py-4 px-4 text-center font-bold">الكمية</th>
                    <th className="py-4 px-4 text-end font-bold">السعر</th>
                    <th className="py-4 px-4 text-end font-bold rounded-tl-xl">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{item.name}</div>
                        {item.description && <div className="text-xs text-gray-500 mt-1">{item.description}</div>}
                      </td>
                      <td className="py-4 px-4 text-center font-medium">{item.quantity}</td>
                      <td className="py-4 px-4 text-end">{Number(item.unit_price).toLocaleString()}</td>
                      <td className="py-4 px-4 text-end font-bold text-emerald-700">{Number(item.total).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-80 bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                  <div className="flex justify-between text-gray-600"><span>المجموع:</span><span className="font-bold">{Number(quotation.subtotal).toLocaleString()}</span></div>
                  {Number(quotation.tax_amount) > 0 && (
                    <div className="flex justify-between text-gray-600"><span>الضريبة المضافة:</span><span className="font-bold">{Number(quotation.tax_amount).toLocaleString()}</span></div>
                  )}
                  <div className="flex justify-between text-xl font-black text-emerald-600 pt-4 border-t border-gray-200">
                    <span>الإجمالي:</span>
                    <span>{Number(quotation.total).toLocaleString()} {quotation.currency_code || 'د.إ'}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-8">
              {/* Payment Mechanism */}
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-4 border-b pb-2">آلية الدفع (Payment Terms)</h3>
                <div className="space-y-4">
                  {paymentMechanism.map((pm: any, i: number) => pm.percentage && (
                    <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-white text-emerald-600 font-black text-lg w-12 h-12 flex items-center justify-center rounded-lg shadow-sm border border-emerald-100">
                          {pm.percentage}%
                        </div>
                        <span className="font-medium text-gray-700 text-sm">{pm.description}</span>
                      </div>
                      <div className="font-bold text-gray-900">
                        {((Number(quotation.total) * Number(pm.percentage)) / 100).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              {quotation.terms_conditions && (
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-4 border-b pb-2">شروط وأحكام العرض</h3>
                  <div className="text-xs text-gray-600 leading-loose whitespace-pre-wrap bg-gray-50 p-5 rounded-xl border border-gray-100 h-full">
                    {quotation.terms_conditions}
                  </div>
                </div>
              )}
            </section>

            {/* Signatures */}
            <section className="pt-16 mt-16 border-t border-dashed border-gray-200 flex justify-between items-end">
              <div className="text-center w-48">
                <div className="font-bold text-gray-500 text-sm mb-12">موافقة العميل (الطرف الثاني)</div>
                <div className="border-b-2 border-gray-300 mb-2"></div>
                <div className="text-xs text-gray-400">التوقيع والختم</div>
              </div>
              
              <div className="flex items-center gap-8">
                {s.qr_code && (
                  <img src={getImageUrl(s.qr_code)} alt="QR" className="w-24 h-24 p-1 border border-gray-200 rounded-lg" />
                )}
                <div className="text-center w-48">
                  <div className="font-bold text-gray-500 text-sm mb-4">الشركة المنفذة (الطرف الأول)</div>
                  <div className="font-black text-lg text-emerald-900 mb-1">{s.company_name_ar || s.company_name_en || s.company_name || 'الشركة'}</div>
                  <div className="text-xs text-gray-500">معتمد إلكترونياً</div>
                </div>
              </div>
            </section>

          </div>
          
          <PageFooter s={s} pageNum={5} totalPages={5} />
        </div>

      </div>

      <style>{`
        /* Minimal print CSS, relying on tailwind for the rest */
        .a4-page {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          margin-bottom: 2rem;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          overflow: hidden;
          position: relative;
        }

        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          
          .printable-container { width: 210mm; margin: 0; position: absolute; top: 0; left: 0; }
          .printable-container, .printable-container * { visibility: visible; }
          
          .a4-page {
            box-shadow: none;
            margin: 0;
            page-break-after: always;
            border: none;
          }
          .a4-page:last-child { page-break-after: auto; }
        }
      `}</style>
    </div>
  )
}

function PageHeader({ s }: { s: any }) {
  const getImageUrl = (path: string | undefined) => {
    const finalPath = path || s.logo_path || s.logo
    if (!finalPath) return ''
    if (finalPath.startsWith('http')) return finalPath
    return finalPath.startsWith('/') ? finalPath : '/' + finalPath
  }
  
  return (
    <div className="px-12 py-8 flex justify-between items-center border-b border-gray-100">
      {(s.logo_path || s.logo) ? (
        <img src={getImageUrl(s.logo_path || s.logo)} alt="Logo" className="h-12 object-contain" />
      ) : (
        <div className="font-black text-2xl text-emerald-600">{s.company_name_ar || s.company_name_en || s.company_name || 'الشركة'}</div>
      )}
      <div className="text-end">
        <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">Proposal</div>
        <div className="font-bold text-emerald-900 text-sm">عرض فني ومالي</div>
      </div>
    </div>
  )
}

function PageFooter({ s, pageNum, totalPages }: { s: any, pageNum: number, totalPages: number }) {
  return (
    <div className="px-12 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center mt-auto">
      <div className="flex gap-6 text-xs font-medium text-gray-500">
        {s.company_website && <span className="flex items-center gap-1">{s.company_website}</span>}
        {s.company_email && <span className="flex items-center gap-1">{s.company_email}</span>}
      </div>
      <div className="text-xs font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">
        الصفحة {pageNum} / {totalPages}
      </div>
    </div>
  )
}
