import { useState, useEffect } from 'react'
import { X, Save, RefreshCw } from 'lucide-react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface RenewalFormModalProps {
  isOpen: boolean
  onClose: () => void
  renewalToEdit?: any
}

export default function RenewalFormModal({ isOpen, onClose, renewalToEdit }: RenewalFormModalProps) {
  const queryClient = useQueryClient()
  
  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get('/clients').then(r => r.data)
  })

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects').then(r => r.data)
  })

  const [formData, setFormData] = useState({
    type: 'domain',
    name: '',
    client_id: '',
    project_id: '',
    start_date: '',
    expiry_date: '',
    cost: '',
    price: '',
    status: 'active',
    auto_renew: false,
    notes: ''
  })

  useEffect(() => {
    if (renewalToEdit) {
      setFormData({
        type: renewalToEdit.type || 'domain',
        name: renewalToEdit.name || '',
        client_id: renewalToEdit.client_id || '',
        project_id: renewalToEdit.project_id || '',
        start_date: renewalToEdit.start_date || '',
        expiry_date: renewalToEdit.expiry_date || '',
        cost: renewalToEdit.cost || '',
        price: renewalToEdit.price || '',
        status: renewalToEdit.status || 'active',
        auto_renew: renewalToEdit.auto_renew || false,
        notes: renewalToEdit.notes || ''
      })
    } else {
      const now = new Date()
      const formattedNow = now.toISOString().split('T')[0]
      const nextYear = new Date(now)
      nextYear.setFullYear(now.getFullYear() + 1)
      const formattedNextYear = nextYear.toISOString().split('T')[0]

      setFormData({
        type: 'domain',
        name: '',
        client_id: '',
        project_id: '',
        start_date: formattedNow,
        expiry_date: formattedNextYear,
        cost: '',
        price: '',
        status: 'active',
        auto_renew: false,
        notes: ''
      })
    }
  }, [renewalToEdit, isOpen])

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = { ...data }
      if (!payload.client_id) delete payload.client_id
      if (!payload.project_id) delete payload.project_id
      if (!payload.cost) payload.cost = 0
      if (!payload.price) payload.price = 0

      if (renewalToEdit) {
        return api.put(`/renewals/${renewalToEdit.id}`, payload)
      }
      return api.post('/renewals', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['renewals'] })
      onClose()
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <RefreshCw size={18} className="text-emerald-500" />
            {renewalToEdit ? 'تعديل بيانات التجديد' : 'إضافة تجديد جديد'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--surface))] rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">اسم العنصر (مثال: دومين، استضافة...)</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">نوع التجديد</label>
              <select 
                className="form-input"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="domain">دومين (Domain)</option>
                <option value="hosting">استضافة (Hosting)</option>
                <option value="maintenance">عقد صيانة</option>
                <option value="subscription">اشتراك (أخرى)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">العميل المرتبط (اختياري)</label>
              <select 
                className="form-input"
                value={formData.client_id}
                onChange={e => setFormData({...formData, client_id: e.target.value})}
              >
                <option value="">-- بدون عميل --</option>
                {(clientsData?.data || []).map((client: any) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">المشروع المرتبط (اختياري)</label>
              <select 
                className="form-input"
                value={formData.project_id}
                onChange={e => setFormData({...formData, project_id: e.target.value})}
              >
                <option value="">-- بدون مشروع --</option>
                {(projectsData?.data || []).map((project: any) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">تاريخ البدء / التفعيل</label>
              <input 
                type="date" 
                className="form-input text-left" dir="ltr"
                value={formData.start_date}
                onChange={e => setFormData({...formData, start_date: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">تاريخ الانتهاء (موعد التجديد القادم)</label>
              <input 
                type="date" 
                className="form-input text-left" dir="ltr"
                value={formData.expiry_date}
                onChange={e => setFormData({...formData, expiry_date: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">التكلفة الأساسية (د.إ)</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="التكلفة التي تدفعها الشركة"
                value={formData.cost}
                onChange={e => setFormData({...formData, cost: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">سعر التجديد للعميل (د.إ)</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="السعر الذي يدفعه العميل لك"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">حالة التجديد</label>
              <select 
                className="form-input"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">نشط (فعال)</option>
                <option value="expired">منتهي</option>
                <option value="renewed">تم التجديد</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>
            <div className="space-y-1 flex items-end">
              <label className="flex items-center gap-2 cursor-pointer p-3 border border-[hsl(var(--border))] rounded-lg w-full">
                <input 
                  type="checkbox" 
                  checked={formData.auto_renew}
                  onChange={e => setFormData({...formData, auto_renew: e.target.checked})}
                  className="rounded border-[hsl(var(--border))] text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold">تجديد تلقائي (Auto Renew)</span>
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">ملاحظات إضافية</label>
            <textarea 
              className="form-input min-h-[80px]"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </div>

        <div className="p-5 border-t border-[hsl(var(--border))] flex justify-end gap-3 bg-[hsl(var(--surface))] rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            إلغاء
          </button>
          <button 
            onClick={() => saveMutation.mutate(formData)}
            disabled={saveMutation.isPending || !formData.name || !formData.expiry_date}
            className="btn-primary"
          >
            <Save size={16} />
            {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </div>
    </div>
  )
}
