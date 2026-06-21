import { useState, useRef } from 'react'
import { Briefcase, ArrowRight, Search, FileText, CheckCircle2, ShieldAlert, LogOut, CheckCircle, Printer, Download, Eye } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { Modal } from '@/components/ui/Modal'

export default function ClientTrackingPage() {
  const [credentials, setCredentials] = useState({ name: '', client_code: '' })
  const [clientData, setClientData] = useState<any>(null)
  const [selectedDoc, setSelectedDoc] = useState<{type: string, data: any} | null>(null)
  
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }
  
  const loginMutation = useMutation({
    mutationFn: (data: typeof credentials) => api.post('/track/login', data).then(r => r.data),
    onSuccess: (data) => {
      setClientData(data.client)
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'تعذر تسجيل الدخول، يرجى التأكد من البيانات.')
    }
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!credentials.name || !credentials.client_code) return
    loginMutation.mutate(credentials)
  }

  const handleLogout = () => {
    setClientData(null)
    setCredentials({ name: '', client_code: '' })
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] p-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />

        <div className="glass-card w-full max-w-md p-8 relative z-10 animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-tr from-emerald-600 to-green-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
              <Search className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-black text-[hsl(var(--foreground))] mb-2">تتبع أعمالك</h1>
            <p className="text-[hsl(var(--muted))] text-sm">أدخل اسمك وكود العميل الخاص بك للوصول لمشاريعك</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">اسم العميل أو الشركة</label>
              <input 
                type="text" 
                className="form-input h-12 text-lg" 
                placeholder="مثال: شركة مدارك"
                value={credentials.name}
                onChange={e => setCredentials({...credentials, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">كود العميل (Client Code)</label>
              <input 
                type="text" 
                className="form-input h-12 text-lg uppercase tracking-wider" 
                placeholder="CL-2026-1001"
                dir="ltr"
                value={credentials.client_code}
                onChange={e => setCredentials({...credentials, client_code: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary w-full h-12 text-lg mt-6 shadow-lg shadow-emerald-500/20"
              disabled={loginMutation.isPending || !credentials.name || !credentials.client_code}
            >
              {loginMutation.isPending ? 'جاري التحقق...' : 'عرض لوحة المتابعة'}
              <ArrowRight size={20} className="mr-2" />
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-b-4 border-emerald-500">
          <div>
            <h1 className="text-2xl font-black text-[hsl(var(--foreground))] mb-1">أهلاً بك، {clientData.name}</h1>
            <p className="text-[hsl(var(--muted))] flex items-center gap-2">
              <ShieldAlert size={14} /> بوابة التتبع المباشرة
            </p>
          </div>
          <button onClick={handleLogout} className="btn-secondary whitespace-nowrap">
            <LogOut size={16} /> خروج من البوابة
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 text-emerald-500"><Briefcase size={120} /></div>
            <div className="text-[hsl(var(--muted))] font-medium mb-2 relative z-10">المشاريع المفتوحة</div>
            <div className="text-4xl font-black text-[hsl(var(--foreground))] relative z-10">{clientData.projects?.length || 0}</div>
          </div>
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 text-emerald-500"><CheckCircle2 size={120} /></div>
            <div className="text-[hsl(var(--muted))] font-medium mb-2 relative z-10">نسبة الإنجاز</div>
            <div className="text-4xl font-black text-[hsl(var(--foreground))] relative z-10">
              {clientData.projects?.length > 0 
                ? Math.round(clientData.projects.reduce((acc: number, p: any) => acc + (p.progress_percent || 0), 0) / clientData.projects.length) 
                : 0}%
            </div>
          </div>
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 text-amber-500"><FileText size={120} /></div>
            <div className="text-[hsl(var(--muted))] font-medium mb-2 relative z-10">الفواتير غير المسددة</div>
            <div className="text-4xl font-black text-[hsl(var(--foreground))] relative z-10">
              {clientData.invoices?.filter((i:any) => i.status !== 'paid').length || 0}
            </div>
          </div>
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5 text-green-500"><ShieldAlert size={120} /></div>
            <div className="text-[hsl(var(--muted))] font-medium mb-2 relative z-10">العقود النشطة</div>
            <div className="text-4xl font-black text-[hsl(var(--foreground))] relative z-10">
              {clientData.contracts?.filter((c:any) => c.status === 'active').length || 0}
            </div>
          </div>
        </div>

        {/* Projects Tracker */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Briefcase className="text-emerald-500" /> متابعة تقدم المشاريع
          </h2>
          <div className="space-y-6">
            {clientData.projects?.length > 0 ? clientData.projects.map((project: any) => (
              <div key={project.id} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[hsl(var(--foreground))]">{project.name}</h3>
                    <div className="text-sm text-[hsl(var(--muted))] mt-1">تاريخ التسليم المتوقع: {project.expected_end_date || 'غير محدد'}</div>
                  </div>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{project.progress_percent}%</div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-4 bg-[hsl(var(--surface))] rounded-full overflow-hidden mb-8">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000 relative" 
                    style={{ width: `${project.progress_percent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20" style={{ background: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Milestones */}
                  {project.milestones?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-[hsl(var(--foreground))] mb-3">مراحل المشروع الرئيسية</h4>
                      <div className="space-y-2">
                        {project.milestones.map((ms: any) => (
                          <div key={ms.id} className={`p-3 rounded-xl border flex items-center justify-between ${ms.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300' : 'bg-[hsl(var(--surface))] border-[hsl(var(--border))] text-[hsl(var(--muted))]'}`}>
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className={ms.status === 'completed' ? 'text-emerald-500' : 'text-[hsl(var(--muted))] opacity-50'} />
                              <span className="text-sm font-semibold truncate">{ms.title}</span>
                            </div>
                            {ms.due_date && <span className="text-xs opacity-70" dir="ltr">{ms.due_date}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  {project.tasks?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-[hsl(var(--foreground))] mb-3">حالة المهام التفصيلية</h4>
                      <div className="space-y-2">
                        {project.tasks.map((task: any) => (
                          <div key={task.id} className="p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] flex items-center justify-between">
                            <span className="text-sm font-medium text-[hsl(var(--foreground))] truncate max-w-[200px]">{task.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                              {task.status === 'completed' ? 'مكتمل' : 'قيد التنفيذ'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="glass-card p-8 text-center text-[hsl(var(--muted))]">لا توجد مشاريع حالية للمتابعة</div>
            )}
          </div>
        </div>

        {/* Financials & Contracts Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
          {/* Contracts */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <ShieldAlert className="text-green-500" /> العقود والمواثيق
            </h2>
            <div className="glass-card overflow-hidden">
              <div className="divide-y divide-[hsl(var(--border))]">
                {clientData.contracts?.length > 0 ? clientData.contracts.map((contract: any) => (
                  <div 
                    key={contract.id} 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-[hsl(var(--surface-hover))] transition-colors"
                    onClick={() => setSelectedDoc({ type: 'contract', data: contract })}
                  >
                    <div>
                      <div className="font-bold text-[hsl(var(--foreground))] hover:text-green-600 transition-colors">{contract.title}</div>
                      <div className="text-xs text-[hsl(var(--muted))] mt-1">{contract.contract_number}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">{Number(contract.value).toLocaleString('ar-AE')} د.إ</div>
                        <div className={`text-xs mt-1 ${contract.status === 'active' ? 'text-emerald-500' : 'text-[hsl(var(--muted))]'}`}>
                          {contract.status === 'active' ? 'ساري المفعول' : 'منتهي / مسودة'}
                        </div>
                      </div>
                      <button className="p-2 text-[hsl(var(--muted))] hover:text-green-600 bg-[hsl(var(--surface))] rounded-lg"><Eye size={16} /></button>
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-[hsl(var(--muted))]">لا توجد عقود</div>
                )}
              </div>
            </div>
          </div>

          {/* Quotations */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <FileText className="text-amber-500" /> عروض الأسعار
            </h2>
            <div className="glass-card overflow-hidden">
              <div className="divide-y divide-[hsl(var(--border))]">
                {clientData.quotations?.length > 0 ? clientData.quotations.map((quo: any) => (
                  <div 
                    key={quo.id} 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-[hsl(var(--surface-hover))] transition-colors"
                    onClick={() => setSelectedDoc({ type: 'quotation', data: quo })}
                  >
                    <div>
                      <div className="font-bold text-[hsl(var(--foreground))] hover:text-amber-600 transition-colors">{quo.project_name}</div>
                      <div className="text-xs text-[hsl(var(--muted))] mt-1">{quo.quotation_number}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">{Number(quo.total).toLocaleString('ar-AE')} د.إ</div>
                        <div className={`text-xs mt-1 ${quo.status === 'accepted' ? 'text-emerald-500' : quo.status === 'rejected' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {quo.status === 'accepted' ? 'مقبول' : quo.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                        </div>
                      </div>
                      <button className="p-2 text-[hsl(var(--muted))] hover:text-amber-600 bg-[hsl(var(--surface))] rounded-lg"><Eye size={16} /></button>
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-[hsl(var(--muted))]">لا توجد عروض أسعار</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
          {/* Invoices */}
          <div>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <FileText className="text-emerald-500" /> الفواتير والمدفوعات
            </h2>
            <div className="glass-card overflow-hidden">
              <div className="divide-y divide-[hsl(var(--border))]">
                {clientData.invoices?.length > 0 ? clientData.invoices.map((inv: any) => (
                  <div 
                    key={inv.id} 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-[hsl(var(--surface-hover))] transition-colors"
                    onClick={() => setSelectedDoc({ type: 'invoice', data: inv })}
                  >
                    <div>
                      <div className="font-bold text-[hsl(var(--foreground))] hover:text-emerald-600 transition-colors">{inv.invoice_number}</div>
                      <div className="text-xs text-[hsl(var(--muted))] mt-1">تاريخ الاستحقاق: {inv.due_date}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">{Number(inv.total).toLocaleString('ar-AE')} د.إ</div>
                        <div className={`text-xs mt-1 ${inv.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {inv.status === 'paid' ? 'مدفوعة بالكامل' : `متبقي ${Number(inv.remaining_amount).toLocaleString('ar-AE')} د.إ`}
                        </div>
                      </div>
                      <button className="p-2 text-[hsl(var(--muted))] hover:text-emerald-600 bg-[hsl(var(--surface))] rounded-lg"><Eye size={16} /></button>
                    </div>
                  </div>
                )) : (
                  <div className="p-6 text-center text-[hsl(var(--muted))]">لا توجد فواتير</div>
                )}
              </div>
            </div>
          </div>

          {/* Daily Reports */}
          <div>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <ShieldAlert className="text-emerald-500" /> التقارير الدورية للمشروع
            </h2>
            <div className="glass-card overflow-hidden">
              <div className="divide-y divide-[hsl(var(--border))]">
                {clientData.dailyReports?.length > 0 ? clientData.dailyReports.map((report: any) => (
                  <div key={report.id} className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-emerald-500 font-bold mb-1" dir="ltr">{report.report_date}</div>
                      <div className="text-sm font-bold text-[hsl(var(--foreground))]">{report.title}</div>
                      <div className="text-xs text-[hsl(var(--muted))] mt-1 line-clamp-1">{report.work_completed}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 whitespace-nowrap">
                      تم الإرسال
                    </span>
                  </div>
                )) : (
                  <div className="p-6 text-center text-[hsl(var(--muted))]">لا توجد تقارير حالياً</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Document Print Modal */}
        <Modal 
          isOpen={!!selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
          title={selectedDoc?.type === 'invoice' ? 'تفاصيل الفاتورة' : selectedDoc?.type === 'quotation' ? 'عرض السعر' : 'تفاصيل العقد'}
          size="2xl"
        >
          {selectedDoc && (
            <div>
              <div className="flex justify-end mb-4 print:hidden">
                <button onClick={handlePrint} className="btn-primary gap-2">
                  <Printer size={16} /> طباعة / حفظ كـ PDF
                </button>
              </div>

              {/* Printable Area */}
              <div ref={printRef} className="print-area bg-white text-black p-8 rounded-xl border border-[hsl(var(--border))] print:border-none print:p-0">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-8 border-b pb-6">
                  <div>
                    <h1 className="text-3xl font-black text-emerald-600 mb-2">مدارك تِك</h1>
                    <p className="text-gray-500 text-sm">لحلول الأعمال وتقنية المعلومات</p>
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {selectedDoc.type === 'invoice' ? 'فاتورة ضريبية' : selectedDoc.type === 'quotation' ? 'عرض سعر' : 'عقد اتفاق'}
                    </h2>
                    <div className="text-sm text-gray-600 font-mono font-bold">
                      #{selectedDoc.data.invoice_number || selectedDoc.data.quotation_number || selectedDoc.data.contract_number}
                    </div>
                  </div>
                </div>

                {/* Info block */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-bold">إلى السيد/الشركة</div>
                    <div className="font-bold text-lg">{clientData.name}</div>
                    <div className="text-gray-600">{clientData.company_name}</div>
                    <div className="text-sm font-mono text-emerald-600 mt-1">{clientData.client_code}</div>
                  </div>
                  <div className="text-left">
                    {selectedDoc.type === 'invoice' && (
                      <>
                        <div className="text-xs text-gray-500 mb-1 font-bold">تاريخ الاستحقاق</div>
                        <div className="font-bold">{selectedDoc.data.due_date}</div>
                        <div className="text-xs text-gray-500 mt-3 mb-1 font-bold">الحالة</div>
                        <div className={`font-bold ${selectedDoc.data.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {selectedDoc.data.status === 'paid' ? 'مسددة بالكامل' : 'مستحقة'}
                        </div>
                      </>
                    )}
                    {selectedDoc.type === 'contract' && (
                      <>
                        <div className="text-xs text-gray-500 mb-1 font-bold">تاريخ البدء والانتهاء</div>
                        <div className="font-bold">{selectedDoc.data.start_date} - {selectedDoc.data.end_date}</div>
                        <div className="text-xs text-gray-500 mt-3 mb-1 font-bold">حالة العقد</div>
                        <div className={`font-bold ${selectedDoc.data.status === 'active' ? 'text-emerald-600' : 'text-gray-600'}`}>
                          {selectedDoc.data.status === 'active' ? 'ساري المفعول' : 'منتهي / غير مفعل'}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Financials block */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">إجمالي القيمة المستحقة</div>
                    <div className="text-4xl font-black text-gray-900">
                      {Number(selectedDoc.data.total || selectedDoc.data.value).toLocaleString('ar-AE')} <span className="text-xl text-gray-500 font-normal">د.إ</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500 mt-12 pt-8 border-t">
                  هذه الوثيقة مستخرجة إلكترونياً من بوابة تتبع العملاء لشركة مدارك تِك.
                  <br/> شكراً لثقتكم بنا.
                </div>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </div>
  )
}
