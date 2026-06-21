import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Plus, Trash2, Receipt } from 'lucide-react'
import api from '@/lib/api'

interface InvoiceFormModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceToEdit?: any
}

export default function InvoiceFormModal({ isOpen, onClose, invoiceToEdit }: InvoiceFormModalProps) {
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    client_id: '',
    project_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    discount_amount: 0,
    notes: '',
    terms: '',
    items: [
      { id: Date.now(), description: '', quantity: 1, unit_price: 0, total: 0 }
    ]
  })

  // Set form data when opening for edit
  useMemo(() => {
    if (invoiceToEdit && isOpen) {
      setFormData({
        client_id: invoiceToEdit.client_id || '',
        project_id: invoiceToEdit.project_id || '',
        issue_date: invoiceToEdit.issue_date ? new Date(invoiceToEdit.issue_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        due_date: invoiceToEdit.due_date ? new Date(invoiceToEdit.due_date).toISOString().split('T')[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        discount_amount: invoiceToEdit.discount_amount || 0,
        notes: invoiceToEdit.notes || '',
        terms: invoiceToEdit.terms || '',
        items: invoiceToEdit.items?.length > 0 ? invoiceToEdit.items.map((item: any, idx: number) => ({
          id: Date.now() + idx,
          description: item.description || '',
          quantity: item.quantity || 1,
          unit_price: item.unit_price || 0,
          total: item.total || 0
        })) : [{ id: Date.now(), description: '', quantity: 1, unit_price: 0, total: 0 }]
      })
    } else if (isOpen) {
      // Reset form when opening for create
      setFormData({
        client_id: '',
        project_id: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        discount_amount: 0,
        notes: '',
        terms: '',
        items: [{ id: Date.now(), description: '', quantity: 1, unit_price: 0, total: 0 }]
      })
    }
  }, [invoiceToEdit, isOpen])

  const { data: clientsData } = useQuery({
    queryKey: ['clients-list'],
    queryFn: () => api.get('/clients?per_page=100').then(r => r.data)
  })
  
  const { data: projectsData } = useQuery({
    queryKey: ['projects-list'],
    queryFn: () => api.get(`/projects?per_page=100`).then(r => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/invoices', data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      onClose()
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.put(`/invoices/${invoiceToEdit.id}`, data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['invoice', invoiceToEdit.id] })
      onClose()
    }
  })

  // Calculations
  const calculatedItems = useMemo(() => {
    return formData.items.map(item => ({
      ...item,
      total: Number(item.quantity) * Number(item.unit_price)
    }))
  }, [formData.items])

  const subtotal = useMemo(() => calculatedItems.reduce((acc, item) => acc + item.total, 0), [calculatedItems])
  const discountAmount = Number(formData.discount_amount) || 0
  const taxAmount = 0
  const total = subtotal - discountAmount

  const handleItemChange = (id: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), description: '', quantity: 1, unit_price: 0, total: 0 }]
    }))
  }

  const removeItem = (id: number) => {
    if (formData.items.length === 1) return
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.client_id) {
      alert('يرجى اختيار العميل')
      return
    }

    const payload: any = {
      ...formData,
      subtotal,
      tax_amount: taxAmount,
      total,
      remaining_amount: total,
      items: calculatedItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total
      }))
    }

    if (invoiceToEdit) {
      updateMutation.mutate(payload)
    } else {
      payload.invoice_number = 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000)
      payload.status = 'unpaid'
      createMutation.mutate(payload)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[hsl(var(--background))] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))] sticky top-0 bg-[hsl(var(--background))] z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Receipt size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{invoiceToEdit ? 'تعديل الفاتورة' : 'إنشاء فاتورة جديدة'}</h2>
              <p className="text-sm text-[hsl(var(--muted))]">{invoiceToEdit ? 'تعديل بيانات الفاتورة' : 'إصدار فاتورة للعميل مباشرة'}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-[hsl(var(--surface))] rounded-lg transition-colors relative z-50 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col gap-8">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">العميل <span className="text-red-500">*</span></label>
              <select 
                value={formData.client_id} 
                onChange={e => setFormData({...formData, client_id: e.target.value})}
                className="form-input w-full"
                required
              >
                <option value="">-- اختر العميل --</option>
                {clientsData?.data?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.company_name || c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">المشروع المرتبط (اختياري)</label>
              <select 
                value={formData.project_id} 
                onChange={e => setFormData({...formData, project_id: e.target.value})}
                className="form-input w-full"
              >
                <option value="">-- اختر المشروع --</option>
                {projectsData?.data?.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">تاريخ الإصدار <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                value={formData.issue_date}
                onChange={e => setFormData({...formData, issue_date: e.target.value})}
                className="form-input w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">تاريخ الاستحقاق <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                value={formData.due_date}
                onChange={e => setFormData({...formData, due_date: e.target.value})}
                className="form-input w-full"
                required
              />
            </div>
          </div>

          <div className="h-px bg-[hsl(var(--border))] w-full"></div>

          {/* Items */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">بنود الفاتورة</h3>
            <div className="border border-[hsl(var(--border))] rounded-xl overflow-hidden">
              <table className="w-full text-start text-sm">
                <thead className="bg-[hsl(var(--surface))]">
                  <tr>
                    <th className="p-3 text-start font-semibold">الوصف</th>
                    <th className="p-3 text-center font-semibold w-24">الكمية</th>
                    <th className="p-3 text-center font-semibold w-32">السعر الإفرادي</th>
                    <th className="p-3 text-center font-semibold w-32">المجموع</th>
                    <th className="p-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--border))]">
                  {calculatedItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2">
                        <input 
                          type="text" 
                          placeholder="وصف البند..."
                          value={item.description}
                          onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                          className="w-full bg-transparent border-0 focus:ring-0 p-2 outline-none"
                          required
                        />
                      </td>
                      <td className="p-2">
                        <input 
                          type="number" 
                          min="1"
                          value={item.quantity}
                          onChange={e => handleItemChange(item.id, 'quantity', e.target.value)}
                          className="w-full text-center bg-transparent border-0 focus:ring-0 p-2 outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input 
                          type="number" 
                          min="0"
                          value={item.unit_price}
                          onChange={e => handleItemChange(item.id, 'unit_price', e.target.value)}
                          className="w-full text-center bg-transparent border-0 focus:ring-0 p-2 outline-none"
                        />
                      </td>
                      <td className="p-2 text-center font-bold">
                        {item.total.toLocaleString()}
                      </td>
                      <td className="p-2 text-center">
                        <button 
                          type="button" 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={calculatedItems.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-[hsl(var(--surface))] border-t border-[hsl(var(--border))]">
                <button 
                  type="button" 
                  onClick={addItem}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Plus size={16} /> إضافة بند جديد
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ملاحظات الفاتورة</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="form-input w-full min-h-[100px]"
                  placeholder="أي ملاحظات إضافية للعميل..."
                ></textarea>
              </div>
            </div>
            
            <div className="w-full md:w-80 bg-[hsl(var(--surface))] rounded-xl p-6 border border-[hsl(var(--border))] space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[hsl(var(--muted))]">المجموع الفرعي:</span>
                <span className="font-semibold">{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[hsl(var(--muted))]">الخصم:</span>
                <input 
                  type="number" 
                  value={formData.discount_amount}
                  onChange={e => setFormData({...formData, discount_amount: Number(e.target.value)})}
                  className="form-input w-24 h-8 px-2 text-end text-sm"
                  placeholder="0.00"
                />
              </div>
              <div className="h-px bg-[hsl(var(--border))] w-full my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold">الإجمالي المستحق:</span>
                <span className="font-black text-xl text-emerald-600">{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[hsl(var(--border))]">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium hover:bg-[hsl(var(--surface))] transition-colors">
              إلغاء
            </button>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="btn-primary px-8">
              {createMutation.isPending || updateMutation.isPending ? 'جاري الحفظ...' : (invoiceToEdit ? 'تحديث الفاتورة' : 'إصدار الفاتورة')}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
