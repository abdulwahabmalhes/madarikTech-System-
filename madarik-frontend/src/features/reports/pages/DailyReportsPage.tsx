import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PrintTemplate } from '@/components/ui/PrintTemplate'
import { useState } from 'react'
import api from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import { ClipboardList, Plus, Search, Send, Calendar, User, Printer, FileText, Share2, CheckSquare, Edit2, Trash2 } from 'lucide-react'

export default function DailyReportsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showView, setShowView] = useState<any>(null)
  const [reportToEdit, setReportToEdit] = useState<any>(null)
  
  const [form, setForm] = useState({
    title: '', project_id: '', client_id: '', report_date: new Date().toISOString().split('T')[0],
    period_type: 'weekly', work_completed: '', next_steps: '', issues: '', completion_percent: 0
  })

  // Queries
  const { data, isLoading } = useQuery({
    queryKey: ['daily-reports', search],
    queryFn: () => api.get('/daily-reports', { params: { per_page: 50, search: search || undefined } }).then(r => r.data),
  })

  const { data: projectsData } = useQuery({
    queryKey: ['projects-list'],
    queryFn: () => api.get('/projects', { params: { per_page: 100 } }).then(r => r.data)
  })

  const addMutation = useMutation({
    mutationFn: (data: any) => api.post('/daily-reports', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-reports'] })
      setShowAdd(false)
      setForm({
        title: '', project_id: '', client_id: '', report_date: new Date().toISOString().split('T')[0],
        period_type: 'weekly', work_completed: '', next_steps: '', issues: '', completion_percent: 0
      })
    }
  })

  const editMutation = useMutation({
    mutationFn: (data: any) => api.put(`/daily-reports/${reportToEdit.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-reports'] })
      setShowAdd(false)
      setReportToEdit(null)
      setForm({
        title: '', project_id: '', client_id: '', report_date: new Date().toISOString().split('T')[0],
        period_type: 'weekly', work_completed: '', next_steps: '', issues: '', completion_percent: 0
      })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/daily-reports/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['daily-reports'] })
  })

  const reports = data?.data ?? []
  const projectsList = projectsData?.data ?? []

  const handleProjectSelect = (projectId: string) => {
    const proj = projectsList.find((p: any) => p.id.toString() === projectId)
    setForm({ ...form, project_id: projectId, client_id: proj?.client_id || '' })
  }

  const shareOnWhatsApp = (report: any) => {
    const text = `*تقرير الإنجاز الأسبوعي*\nالمشروع: ${report.project?.name}\nالتاريخ: ${new Date(report.report_date).toLocaleDateString('ar-AE')}\n\n*📌 ما تم إنجازه هذا الأسبوع:*\n${report.work_completed || '—'}\n\n*🚀 خطة الأسبوع القادم:*\n${report.next_steps || '—'}\n\n${report.issues ? `*⚠️ ملاحظات وتحديات:*\n${report.issues}\n\n` : ''}شكراً لثقتكم بنا!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }

  const printReport = () => {
    const printContent = document.getElementById('print-area');
    if (!printContent) return;

    // Clone the print area to append it directly to the body
    const clone = printContent.cloneNode(true) as HTMLElement;
    clone.id = 'print-clone';
    // Force the clone to be visible and at the top
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.width = '100%';
    clone.style.background = 'white';
    clone.style.zIndex = '999999';
    
    // Unhide print blocks inside the clone
    clone.querySelectorAll('.hidden.print\\:block').forEach((el: any) => {
      el.classList.remove('hidden');
      el.classList.add('block');
    });

    document.body.appendChild(clone);

    // Hide original root and radix portals during print
    const style = document.createElement('style');
    style.id = 'print-overrides';
    style.innerHTML = `
      @media print {
        #root, [data-radix-portal] { display: none !important; }
        body { background: white !important; margin: 0 !important; padding: 0 !important; }
        #print-clone { display: block !important; position: static !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
        @page { size: A4 portrait; margin: 15mm; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      window.print();
      // Cleanup
      document.body.removeChild(clone);
      document.head.removeChild(style);
    }, 100);
  }

  return (
    <div className="space-y-5">


      {/* Header (Hidden on Print) */}
      <div className="flex items-center justify-between flex-wrap gap-3 print-hidden">
        <div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">التقارير الأسبوعية</h2>
          <p className="text-sm text-[hsl(var(--muted))]">{reports.length} تقرير مسجل</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setReportToEdit(null)
          setForm({
            title: '', project_id: '', client_id: '', report_date: new Date().toISOString().split('T')[0],
            period_type: 'weekly', work_completed: '', next_steps: '', issues: '', completion_percent: 0
          })
          setShowAdd(true)
        }}>
          <Plus size={16} /> تقرير جديد
        </button>
      </div>

      <div className="relative max-w-sm print-hidden">
        <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[hsl(var(--muted))]" />
        <input type="text" placeholder="البحث في التقارير..." value={search}
          onChange={e => setSearch(e.target.value)} className="form-input ps-9 h-9 py-2" />
      </div>

      {isLoading ? (
        <div className="space-y-3 print-hidden">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card h-32 animate-pulse" />)}
        </div>
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print-hidden">
          {reports.map((r: any) => (
            <div key={r.id} className="glass-card p-5 hover:border-emerald-500/30 transition-colors cursor-pointer group" onClick={() => setShowView(r)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-lg text-[hsl(var(--foreground))] leading-tight">{r.title}</div>
                  <div className="text-sm text-emerald-600 font-medium mt-1">{r.project?.name || '—'}</div>
                </div>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-lg">
                  <FileText size={20} />
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="text-xs text-[hsl(var(--muted))] flex items-center gap-1.5">
                  <Calendar size={12} /> {r.report_date ? new Date(r.report_date).toLocaleDateString('ar-AE') : '—'}
                </div>
                <div className="text-xs text-[hsl(var(--muted))] flex items-center gap-1.5 line-clamp-1">
                  <User size={12} /> {r.client?.company_name || r.client?.name || '—'}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[hsl(var(--border))]">
                <button className="flex-1 flex justify-center items-center btn-secondary py-1.5 text-xs bg-[hsl(var(--surface))] border-transparent" onClick={(e) => { e.stopPropagation(); setShowView(r) }}>
                  عرض التفاصيل
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="flex justify-center items-center p-1.5 rounded-md text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 transition-colors" onClick={(e) => { e.stopPropagation(); shareOnWhatsApp(r) }} title="مشاركة عبر الواتساب">
                    <Share2 size={16} />
                  </button>
                  <button className="flex justify-center items-center p-1.5 rounded-md text-[hsl(var(--muted))] hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border border-gray-200 dark:border-gray-700 transition-colors" onClick={(e) => { 
                    e.stopPropagation(); 
                    setReportToEdit(r);
                    setForm({
                      title: r.title,
                      project_id: r.project_id || '',
                      client_id: r.client_id || '',
                      report_date: r.report_date ? new Date(r.report_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                      period_type: r.period_type || 'weekly',
                      work_completed: r.work_completed || '',
                      next_steps: r.next_steps || '',
                      issues: r.issues || '',
                      completion_percent: r.completion_percent || 0
                    });
                    setShowAdd(true);
                  }} title="تعديل التقرير">
                    <Edit2 size={16} />
                  </button>
                  <button className="flex justify-center items-center p-1.5 rounded-md text-[hsl(var(--muted))] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-200 dark:border-gray-700 transition-colors" onClick={(e) => { 
                    e.stopPropagation(); 
                    if (confirm('هل أنت متأكد من حذف هذا التقرير؟')) deleteMutation.mutate(r.id);
                  }} title="حذف التقرير">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center print-hidden">
          <ClipboardList size={40} className="mx-auto text-[hsl(var(--muted))] mb-3 opacity-40" />
          <p className="text-[hsl(var(--muted))]">لا توجد تقارير مسجّلة</p>
          <button className="btn-primary mt-4 mx-auto" onClick={() => {
            setReportToEdit(null)
            setForm({
              title: '', project_id: '', client_id: '', report_date: new Date().toISOString().split('T')[0],
              period_type: 'weekly', work_completed: '', next_steps: '', issues: '', completion_percent: 0
            })
            setShowAdd(true)
          }}>
            <Plus size={16} /> إنشاء أول تقرير أسبوعي
          </button>
        </div>
      )}

      {/* View Report Modal */}
      {showView && (
        <Modal isOpen={!!showView} onClose={() => setShowView(null)} title="تفاصيل التقرير الأسبوعي" size="lg">
          <PrintTemplate title="تقرير إنجاز أسبوعي">
            
            {/* Meta Information Table */}
            <div className="mb-8 mt-6">
              <table className="w-full text-sm border-collapse border border-gray-300 dark:border-slate-700 print:border-gray-400">
                <tbody>
                  <tr>
                    <td className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-3 bg-gray-50 dark:bg-slate-800 print:bg-gray-100 font-bold w-1/3 text-right">عنوان التقرير</td>
                    <td className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-3 font-medium text-emerald-700 dark:text-emerald-400 print:text-black text-right">{showView.title}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-3 bg-gray-50 dark:bg-slate-800 print:bg-gray-100 font-bold text-right">المشروع</td>
                    <td className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-3 text-right">{showView.project?.name}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-3 bg-gray-50 dark:bg-slate-800 print:bg-gray-100 font-bold text-right">العميل</td>
                    <td className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-3 text-right">{showView.client?.company_name || showView.client?.name}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-3 bg-gray-50 dark:bg-slate-800 print:bg-gray-100 font-bold text-right">تاريخ التقرير</td>
                    <td className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-3 text-right">{new Date(showView.report_date).toLocaleDateString('ar-AE', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Content Sections */}
            <div className="space-y-6 print:space-y-8">
              
              {/* Work Completed */}
              <div>
                <table className="w-full border-collapse border border-gray-300 dark:border-slate-700 print:border-gray-400">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-4 bg-gray-50 dark:bg-slate-800 print:bg-gray-100 text-right font-bold text-gray-900 dark:text-white print:text-black text-lg">
                        ما تم إنجازه هذا الأسبوع
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-6 text-gray-800 dark:text-slate-200 print:text-black whitespace-pre-wrap leading-loose text-base font-medium align-top min-h-[120px] text-right">
                        {showView.work_completed || 'لم يتم تسجيل أي إنجازات.'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Next Steps */}
              <div>
                <table className="w-full border-collapse border border-gray-300 dark:border-slate-700 print:border-gray-400 print:break-inside-avoid">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-4 bg-gray-50 dark:bg-slate-800 print:bg-gray-100 text-right font-bold text-gray-900 dark:text-white print:text-black text-lg">
                        خطة الأسبوع القادم
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-6 text-gray-800 dark:text-slate-200 print:text-black whitespace-pre-wrap leading-loose text-base font-medium align-top min-h-[120px] text-right">
                        {showView.next_steps || 'لم يتم تسجيل أي خطط.'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Issues */}
              {showView.issues && (
                <div>
                  <table className="w-full border-collapse border border-gray-300 dark:border-slate-700 print:border-gray-400 print:break-inside-avoid">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-4 bg-gray-50 dark:bg-slate-800 print:bg-gray-100 text-right font-bold text-gray-900 dark:text-white print:text-black text-lg">
                          تحديات وملاحظات
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 dark:border-slate-700 print:border-gray-400 p-6 text-gray-800 dark:text-slate-200 print:text-black whitespace-pre-wrap leading-loose text-base font-medium align-top text-right">
                          {showView.issues}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Print Footer */}
            <div className="mt-16 pt-4 border-t-2 border-gray-800 text-center hidden print:block print:break-inside-avoid">
              <p className="text-sm font-bold text-gray-900 mb-1">تم إصدار هذا التقرير من نظام إدارة المشاريع - شركة مدارك التقنية</p>
              <p className="text-xs text-gray-500">هذا المستند موجه للعميل المذكور أعلاه ويعتبر تقريراً دورياً لسير العمل.</p>
            </div>
          </PrintTemplate>

          <div className="flex justify-end gap-3 pt-6 print-hidden">
            <button className="btn-secondary" onClick={() => shareOnWhatsApp(showView)}>
              <Share2 size={16} className="me-2 text-emerald-500" /> مشاركة واتساب
            </button>
            <button className="btn-primary" onClick={printReport}>
              <Printer size={16} className="me-2" /> طباعة / حفظ PDF
            </button>
          </div>
        </Modal>
      )}

      {/* Add Report Modal */}
      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setReportToEdit(null); }} title={reportToEdit ? "تعديل التقرير الأسبوعي" : "إنشاء تقرير أسبوعي جديد"} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">عنوان التقرير</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="form-input" placeholder="مثال: تقرير الأسبوع الأول - مشروع المتجر" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">المشروع</label>
              <select value={form.project_id} onChange={e => handleProjectSelect(e.target.value)} className="form-input">
                <option value="">-- اختر المشروع --</option>
                {projectsList.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">تاريخ التقرير</label>
              <input type="date" value={form.report_date} onChange={e => setForm({...form, report_date: e.target.value})} className="form-input" />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-emerald-500 mb-1.5">✅ ما تم إنجازه هذا الأسبوع</label>
            <textarea 
              value={form.work_completed} 
              onChange={e => setForm({...form, work_completed: e.target.value})} 
              className="form-input min-h-[100px] resize-y" 
              placeholder="سجل أهم الإنجازات والمهام التي تم الانتهاء منها..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-500 mb-1.5">🚀 خطة الأسبوع القادم</label>
            <textarea 
              value={form.next_steps} 
              onChange={e => setForm({...form, next_steps: e.target.value})} 
              className="form-input min-h-[100px] resize-y" 
              placeholder="المهام المجدولة للأسبوع القادم..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">تحديات أو ملاحظات (اختياري)</label>
            <textarea 
              value={form.issues} 
              onChange={e => setForm({...form, issues: e.target.value})} 
              className="form-input min-h-[60px] resize-y" 
              placeholder="أي معوقات أو ملاحظات تحتاج انتباه العميل..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button className="btn-secondary" onClick={() => { setShowAdd(false); setReportToEdit(null); }}>إلغاء</button>
            <button 
              className="btn-primary" 
              onClick={() => reportToEdit ? editMutation.mutate(form) : addMutation.mutate(form)}
              disabled={!form.title || !form.project_id || addMutation.isPending || editMutation.isPending}
            >
              {addMutation.isPending || editMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ التقرير'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
