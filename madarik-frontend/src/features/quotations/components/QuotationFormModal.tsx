import { useState, useEffect } from 'react'
import { X, Plus, Trash2, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export function QuotationFormModal({ quotation, onClose, isEditing }: any) {
  const queryClient = useQueryClient()
  const [step, setStep] = useState(1)

  const { data: clientsRes } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get('/clients').then(r => r.data)
  })
  const clients = Array.isArray(clientsRes) ? clientsRes : (Array.isArray(clientsRes?.data) ? clientsRes.data : [])

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(r => r.data)
  })

  const products = Array.isArray(productsData) ? productsData : (Array.isArray(productsData?.data) ? productsData.data : [])

  const [formData, setFormData] = useState<any>({
    quotation_number: '',
    client_id: '',
    project_name: '',
    issue_date: '',
    expiry_date: '',
    status: 'draft',
    project_overview: '',
    project_goals: '',
    project_type: '',
    sections: [{ title: '', description: '', bullet_points: [''] }],
    deliverables: [''],
    execution_days: '',
    delivery_date: '',
    support_duration: '',
    support_includes: [''],
    support_excludes: [''],
    ui_ux_design: [''],
    payment_mechanism: [{ percentage: 50, description: 'دفعة مقدمة عند توقيع العقد' }, { percentage: 50, description: 'عند التسليم النهائي' }],
    items: [{ id: Date.now(), name: '', description: '', quantity: 1, unit_price: 0, total: 0 }],
    notes: '',
    terms_conditions: '',
  })

  // Safe parsing of JSON arrays from DB if they come back as strings occasionally
  const parseArray = (val: any, defaultVal: any[]) => {
    if (!val) return defaultVal;
    if (Array.isArray(val) && val.length > 0) return val;
    try { 
      const parsed = typeof val === 'string' ? JSON.parse(val) : val;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultVal;
    } catch(e) { 
      return defaultVal;
    }
  }

  useEffect(() => {
    if (isEditing && quotation) {
      setFormData({
        ...formData,
        ...quotation,
        issue_date: quotation.issue_date ? quotation.issue_date.split('T')[0] : '',
        expiry_date: quotation.expiry_date ? quotation.expiry_date.split('T')[0] : '',
        delivery_date: quotation.delivery_date ? quotation.delivery_date.split('T')[0] : '',
        sections: parseArray(quotation.sections, formData.sections),
        deliverables: parseArray(quotation.deliverables, formData.deliverables),
        support_includes: parseArray(quotation.support_includes, formData.support_includes),
        support_excludes: parseArray(quotation.support_excludes, formData.support_excludes),
        ui_ux_design: parseArray(quotation.ui_ux_design, formData.ui_ux_design),
        payment_mechanism: parseArray(quotation.payment_mechanism, formData.payment_mechanism),
        items: parseArray(quotation.items, formData.items),
      })
    }
  }, [quotation, isEditing])

  // Helpers for generic array fields
  const handleArrayChange = (field: string, index: number, value: string) => {
    const arr = [...formData[field]]
    arr[index] = value
    setFormData({ ...formData, [field]: arr })
  }
  const addArrayItem = (field: string) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] })
  }
  const removeArrayItem = (field: string, index: number) => {
    const arr = [...formData[field]]
    arr.splice(index, 1)
    setFormData({ ...formData, [field]: arr })
  }

  // Helpers for sections
  const handleSectionChange = (sIndex: number, field: string, value: any) => {
    const newSections = [...formData.sections]
    newSections[sIndex][field] = value
    setFormData({ ...formData, sections: newSections })
  }
  const handleSectionBulletChange = (sIndex: number, bIndex: number, value: string) => {
    const newSections = [...formData.sections]
    newSections[sIndex].bullet_points[bIndex] = value
    setFormData({ ...formData, sections: newSections })
  }
  const addSectionBullet = (sIndex: number) => {
    const newSections = [...formData.sections]
    newSections[sIndex].bullet_points.push('')
    setFormData({ ...formData, sections: newSections })
  }
  const removeSectionBullet = (sIndex: number, bIndex: number) => {
    const newSections = [...formData.sections]
    newSections[sIndex].bullet_points.splice(bIndex, 1)
    setFormData({ ...formData, sections: newSections })
  }
  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: '', description: '', bullet_points: [''] }]
    })
  }
  const removeSection = (sIndex: number) => {
    const newSections = [...formData.sections]
    newSections.splice(sIndex, 1)
    setFormData({ ...formData, sections: newSections })
  }

  // Helpers for items
  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    
    if (field === 'name') {
      const selectedProduct = products.find((p: any) => p.name === value)
      if (selectedProduct) {
        newItems[index].description = selectedProduct.description || ''
        newItems[index].unit_price = selectedProduct.price || 0
      }
    }
    
    if (field === 'quantity' || field === 'unit_price' || field === 'name') {
      const q = Number(newItems[index].quantity) || 0
      const p = Number(newItems[index].unit_price) || 0
      newItems[index].total = q * p
    }
    
    setFormData({ ...formData, items: newItems })
  }
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { id: Date.now(), name: '', description: '', quantity: 1, unit_price: 0, total: 0 }]
    })
  }
  const removeItem = (index: number) => {
    const newItems = [...formData.items]
    newItems.splice(index, 1)
    setFormData({ ...formData, items: newItems })
  }

  // Helpers for payment mechanism
  const handlePaymentChange = (index: number, field: string, value: any) => {
    const newPayments = [...formData.payment_mechanism]
    newPayments[index][field] = value
    setFormData({ ...formData, payment_mechanism: newPayments })
  }
  const addPayment = () => {
    setFormData({
      ...formData,
      payment_mechanism: [...formData.payment_mechanism, { percentage: 0, description: '' }]
    })
  }
  const removePayment = (index: number) => {
    const newPayments = [...formData.payment_mechanism]
    newPayments.splice(index, 1)
    setFormData({ ...formData, payment_mechanism: newPayments })
  }

  const subtotal = formData.items.reduce((sum: number, item: any) => sum + (Number(item.total) || 0), 0)
  const tax_amount = subtotal * 0.05
  const grand_total = subtotal + tax_amount

  const saveMutation = useMutation({
    mutationFn: (payload: any) => 
      isEditing 
        ? api.put(`/quotations/${quotation.id}`, payload).then(r => r.data)
        : api.post('/quotations', payload).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      if (isEditing) queryClient.invalidateQueries({ queryKey: ['quotation', quotation.id] })
      onClose()
    },
    onError: (err: any) => {
      alert('حدث خطأ أثناء الحفظ. يرجى التأكد من ملء جميع الحقول المطلوبة.')
      console.error(err)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 4) {
      setStep(step + 1)
      return
    }
    
    const payload = { 
      ...formData,
      subtotal,
      tax_amount,
      tax_percent: 5,
      total: grand_total,
    }
    
    if (!payload.client_id) delete (payload as any).client_id
    
    payload.items = payload.items.map((item: any) => {
      const { id, ...rest } = item
      return isEditing && id && String(id).length < 13 ? item : rest
    })
    
    payload.sections = payload.sections.map((sec: any, idx: number) => ({...sec, order: idx}))

    saveMutation.mutate(payload)
  }

  const stepTitles = [
    'الأساسيات والمشروع',
    'نطاق العمل والتفاصيل',
    'التسليمات والدعم والمدة',
    'التكاليف والآلية'
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'تعديل عرض السعر' : 'إنشاء عرض سعر احترافي جديد'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">الخطوة {step} من 4: {stepTitles[step - 1]}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-slate-900/50">
          <datalist id="products-list">
            {products.map((p: any) => (
              <option key={p.id} value={p.name} />
            ))}
          </datalist>

          {step === 1 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-5">
                <h4 className="font-bold text-lg border-b dark:border-slate-700 pb-2">بيانات العميل والمشروع</h4>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">العميل *</label>
                    <select required value={formData.client_id} onChange={e => setFormData({ ...formData, client_id: e.target.value })} className="form-input">
                      <option value="">-- اختر العميل --</option>
                      {clients.map((c: any) => <option key={c.id} value={c.id}>{c.company_name || c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">اسم المشروع / عنوان العرض *</label>
                    <input required value={formData.project_name} onChange={e => setFormData({ ...formData, project_name: e.target.value })} className="form-input" placeholder="مثال: تطوير تطبيق الجوال" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">نوع المشروع</label>
                    <input value={formData.project_type} onChange={e => setFormData({ ...formData, project_type: e.target.value })} className="form-input" placeholder="مثال: تطبيق iOS و Android" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">تاريخ الإصدار</label>
                    <input type="date" value={formData.issue_date} onChange={e => setFormData({ ...formData, issue_date: e.target.value })} className="form-input" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">نبذة عن المشروع (Overview)</label>
                  <textarea rows={3} value={formData.project_overview} onChange={e => setFormData({ ...formData, project_overview: e.target.value })} className="form-input" placeholder="اكتب وصفاً جذاباً لفكرة المشروع..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">أهداف المشروع (Goals)</label>
                  <textarea rows={3} value={formData.project_goals} onChange={e => setFormData({ ...formData, project_goals: e.target.value })} className="form-input" placeholder="أهداف المشروع التي سيتم تحقيقها..."></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-lg dark:text-gray-200">أقسام نطاق العمل (Scope of Work)</h4>
                <button type="button" onClick={addSection} className="btn-secondary text-xs"><Plus size={14}/> قسم جديد</button>
              </div>
              
              {formData.sections.map((section: any, sIndex: number) => (
                <div key={sIndex} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm relative">
                  <button type="button" onClick={() => removeSection(sIndex)} className="absolute top-4 left-4 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">عنوان القسم *</label>
                      <input required value={section.title} onChange={e => handleSectionChange(sIndex, 'title', e.target.value)} className="form-input font-bold" placeholder="مثال: تطبيق المستخدم" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">وصف مختصر للقسم</label>
                      <input value={section.description} onChange={e => handleSectionChange(sIndex, 'description', e.target.value)} className="form-input text-sm" placeholder="وصف ما يغطيه هذا القسم..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">النقاط التفصيلية (Features)</label>
                    {section.bullet_points.map((point: string, bIndex: number) => (
                      <div key={bIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <input value={point} onChange={e => handleSectionBulletChange(sIndex, bIndex, e.target.value)} className="form-input text-sm py-1.5" placeholder="نقطة فرعية..." />
                        <button type="button" onClick={() => removeSectionBullet(sIndex, bIndex)} className="text-gray-400 hover:text-red-500 p-1"><X size={14}/></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addSectionBullet(sIndex)} className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-2 hover:underline"><Plus size={12}/> إضافة نقطة</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Deliverables */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                  <h4 className="font-bold text-lg border-b dark:border-slate-700 pb-2 mb-4 dark:text-gray-200">ما سيتم تسليمه (Deliverables)</h4>
                  <div className="space-y-3">
                    {formData.deliverables.map((item: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <input value={item} onChange={e => handleArrayChange('deliverables', index, e.target.value)} className="form-input text-sm py-1.5" placeholder="مثال: الكود المصدري، لوحة التحكم..." />
                        <button type="button" onClick={() => removeArrayItem('deliverables', index)} className="text-gray-400 hover:text-red-500"><X size={16}/></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('deliverables')} className="text-xs text-emerald-600 font-medium flex items-center gap-1 hover:underline"><Plus size={12}/> إضافة عنصر تسليم</button>
                  </div>
                </div>

                {/* UI/UX */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                  <h4 className="font-bold text-lg border-b dark:border-slate-700 pb-2 mb-4 dark:text-gray-200">التصميم وتجربة المستخدم</h4>
                  <div className="space-y-3">
                    {formData.ui_ux_design.map((item: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <input value={item} onChange={e => handleArrayChange('ui_ux_design', index, e.target.value)} className="form-input text-sm py-1.5" placeholder="مثال: تصميم متوافق مع الجوال..." />
                        <button type="button" onClick={() => removeArrayItem('ui_ux_design', index)} className="text-gray-400 hover:text-red-500"><X size={16}/></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('ui_ux_design')} className="text-xs text-emerald-600 font-medium flex items-center gap-1 hover:underline"><Plus size={12}/> إضافة ميزة تصميم</button>
                  </div>
                </div>

                {/* Support */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm md:col-span-2">
                  <h4 className="font-bold text-lg border-b dark:border-slate-700 pb-2 mb-4 flex items-center gap-4 dark:text-gray-200">
                    الدعم الفني والضمان
                    <input value={formData.support_duration} onChange={e => setFormData({...formData, support_duration: e.target.value})} className="form-input text-sm py-1 w-48 font-normal" placeholder="مدة الدعم (مثال: سنة كاملة)"/>
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-emerald-600 mb-2">يشمل الدعم الفني:</label>
                      <div className="space-y-2">
                        {formData.support_includes.map((item: string, index: number) => (
                          <div key={index} className="flex gap-2">
                            <input value={item} onChange={e => handleArrayChange('support_includes', index, e.target.value)} className="form-input text-sm py-1" placeholder="يشمل..." />
                            <button type="button" onClick={() => removeArrayItem('support_includes', index)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('support_includes')} className="text-xs text-emerald-600 font-medium flex items-center gap-1"><Plus size={12}/> إضافة نقطة</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-red-500 mb-2">لا يشمل الدعم الفني:</label>
                      <div className="space-y-2">
                        {formData.support_excludes.map((item: string, index: number) => (
                          <div key={index} className="flex gap-2">
                            <input value={item} onChange={e => handleArrayChange('support_excludes', index, e.target.value)} className="form-input text-sm py-1" placeholder="لا يشمل..." />
                            <button type="button" onClick={() => removeArrayItem('support_excludes', index)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                          </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem('support_excludes')} className="text-xs text-emerald-600 font-medium flex items-center gap-1"><Plus size={12}/> إضافة نقطة</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm md:col-span-2">
                  <h4 className="font-bold text-lg border-b dark:border-slate-700 pb-2 mb-4 dark:text-gray-200">الجدول الزمني للتنفيذ</h4>
                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">مدة التنفيذ (بالأيام)</label>
                      <input type="number" value={formData.execution_days} onChange={e => setFormData({...formData, execution_days: e.target.value})} className="form-input" placeholder="مثال: 45" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 dark:text-gray-200">تاريخ التسليم المتوقع</label>
                      <input type="date" value={formData.delivery_date} onChange={e => setFormData({...formData, delivery_date: e.target.value})} className="form-input" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 max-w-5xl mx-auto">
              
              {/* Items / Pricing Table */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold text-lg border-b dark:border-slate-700 pb-2 mb-4 dark:text-gray-200">التكاليف والخدمات</h4>
                <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-900">
                      <tr>
                        <th className="text-start p-3 font-semibold dark:text-gray-200 w-1/2">الخدمة / البند</th>
                        <th className="text-center p-3 font-semibold dark:text-gray-200 w-24">الكمية</th>
                        <th className="text-end p-3 font-semibold dark:text-gray-200 w-32">السعر</th>
                        <th className="text-end p-3 font-semibold dark:text-gray-200 w-32">الإجمالي</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item: any, index: number) => (
                        <tr key={index} className="border-t border-gray-100 dark:border-slate-700">
                          <td className="p-2">
                            <input list="products-list" required value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} className="form-input mb-1 py-1.5 text-sm font-bold" placeholder="اسم الخدمة..." />
                            <input value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="form-input text-xs py-1" placeholder="وصف إضافي..." />
                          </td>
                          <td className="p-2 align-top"><input type="number" min="1" required value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className="form-input text-center py-1.5" /></td>
                          <td className="p-2 align-top"><input type="number" min="0" step="0.01" required value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', e.target.value)} className="form-input text-end py-1.5" /></td>
                          <td className="p-2 align-top text-end font-bold pt-4 dark:text-gray-200">{Number(item.total).toLocaleString()}</td>
                          <td className="p-2 align-top text-center pt-3"><button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button type="button" onClick={addItem} className="text-sm font-medium text-emerald-600 hover:underline flex items-center gap-1 mb-6"><Plus size={14}/> إضافة خدمة</button>

                <div className="flex justify-end border-t dark:border-slate-700 pt-4">
                  <div className="w-72 space-y-3 bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl text-emerald-900 dark:text-emerald-100">
                    <div className="flex justify-between text-sm"><span>المجموع:</span><span className="font-bold">{subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm text-emerald-700 dark:text-emerald-300"><span>الضريبة (5%):</span><span className="font-bold">{tax_amount.toLocaleString()}</span></div>
                    <div className="flex justify-between text-lg font-black pt-2 border-t border-emerald-200 dark:border-emerald-800"><span>الإجمالي:</span><span>{grand_total.toLocaleString()} د.إ</span></div>
                  </div>
                </div>
              </div>

              {/* Payment Mechanism */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold text-lg border-b dark:border-slate-700 pb-2 mb-4 dark:text-gray-200">آلية الدفع (Payment Mechanism)</h4>
                <div className="space-y-3">
                  {formData.payment_mechanism.map((pm: any, index: number) => (
                    <div key={index} className="flex gap-4 items-center">
                      <div className="w-24 relative">
                        <input type="number" value={pm.percentage} onChange={e => handlePaymentChange(index, 'percentage', e.target.value)} className="form-input pr-6 font-bold text-center text-emerald-600" />
                        <span className="absolute right-3 top-2.5 text-gray-500 font-bold">%</span>
                      </div>
                      <input value={pm.description} onChange={e => handlePaymentChange(index, 'description', e.target.value)} className="form-input flex-1" placeholder="وصف الدفعة (مثال: دفعة أولى عند توقيع العقد)" />
                      <div className="w-32 text-end font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 py-2 rounded-lg px-3">
                        {((grand_total * Number(pm.percentage)) / 100).toLocaleString()} د.إ
                      </div>
                      <button type="button" onClick={() => removePayment(index)} className="text-gray-400 hover:text-red-500"><X size={18}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={addPayment} className="text-sm font-medium text-emerald-600 hover:underline flex items-center gap-1"><Plus size={14}/> إضافة دفعة</button>
                </div>
              </div>

              {/* General Terms */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold text-lg border-b dark:border-slate-700 pb-2 mb-4 dark:text-gray-200">شروط وأحكام العرض</h4>
                <textarea rows={4} value={formData.terms_conditions} onChange={e => setFormData({...formData, terms_conditions: e.target.value})} className="form-input" placeholder="شروط العرض العامة..."></textarea>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(num => (
              <div key={num} className={`w-3 h-3 rounded-full ${step === num ? 'bg-emerald-600' : step > num ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}></div>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary">
                <ChevronRight size={16} /> السابق
              </button>
            )}
            
            {step < 4 ? (
              <button type="button" onClick={(e) => handleSubmit(e)} className="btn-primary px-8">
                التالي <ChevronLeft size={16} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={saveMutation.isPending} className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all">
                <CheckCircle size={18} /> {isEditing ? 'حفظ التحديثات' : 'حفظ وإصدار العرض'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
