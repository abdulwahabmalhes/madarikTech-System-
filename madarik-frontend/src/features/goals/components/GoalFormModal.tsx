import { useState, useEffect } from 'react'
import { X, Save, Target } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

interface GoalFormModalProps {
  isOpen: boolean
  onClose: () => void
  goalToEdit?: any
}

export default function GoalFormModal({ isOpen, onClose, goalToEdit }: GoalFormModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: '',
    type: 'revenue',
    target_value: '',
    current_value: '',
    unit: 'AED',
    period_type: 'monthly',
    period_start: '',
    period_end: '',
    description: '',
    status: 'active'
  })

  useEffect(() => {
    if (goalToEdit) {
      setFormData({
        title: goalToEdit.title || '',
        type: goalToEdit.type || 'revenue',
        target_value: goalToEdit.target_value || '',
        current_value: goalToEdit.current_value || '',
        unit: goalToEdit.unit || 'AED',
        period_type: goalToEdit.period_type || 'monthly',
        period_start: goalToEdit.period_start?.split('T')[0] || '',
        period_end: goalToEdit.period_end?.split('T')[0] || '',
        description: goalToEdit.description || '',
        status: goalToEdit.status || 'active'
      })
    } else {
      setFormData({
        title: '',
        type: 'revenue',
        target_value: '',
        current_value: '',
        unit: 'AED',
        period_type: 'monthly',
        period_start: '',
        period_end: '',
        description: '',
        status: 'active'
      })
    }
  }, [goalToEdit, isOpen])

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = { ...data }
      if (payload.current_value === '') payload.current_value = 0
      if (payload.target_value === '') payload.target_value = 0
      
      if (goalToEdit) {
        return api.put(`/goals/${goalToEdit.id}`, payload)
      }
      return api.post('/goals', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      onClose()
    },
    onError: (err: any) => {
      alert('حدث خطأ: \n' + (err.response?.data?.message || err.message))
      console.error(err)
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Target size={18} className="text-emerald-500" />
            {goalToEdit ? 'تعديل الهدف' : 'إضافة هدف جديد'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--surface))] rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold">عنوان الهدف</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="مثال: زيادة مبيعات الربع الأول"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">النوع</label>
              <select 
                className="form-input"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="revenue">إيرادات</option>
                <option value="leads">عملاء محتملين</option>
                <option value="projects">مشاريع منجزة</option>
                <option value="other">أخرى</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">القيمة المستهدفة</label>
              <div className="grid grid-cols-3 gap-2">
                <input 
                  type="text" 
                  className="form-input col-span-2" 
                  placeholder="الرقم (مثال: 50000)"
                  value={formData.target_value}
                  onChange={e => setFormData({...formData, target_value: e.target.value.replace(/[^0-9.]/g, '')})}
                />
                <input 
                  type="text" 
                  className="form-input col-span-1 text-center" 
                  placeholder="الوحدة (AED)"
                  value={formData.unit}
                  onChange={e => setFormData({...formData, unit: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-emerald-600">الرصيد الافتتاحي / الإنجاز الأولي (اختياري)</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="مثال: 1000"
              value={formData.current_value}
              onChange={e => setFormData({...formData, current_value: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">تاريخ البداية</label>
              <input 
                type="date" 
                className="form-input"
                value={formData.period_start}
                onChange={e => setFormData({...formData, period_start: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">تاريخ النهاية</label>
              <input 
                type="date" 
                className="form-input"
                value={formData.period_end}
                onChange={e => setFormData({...formData, period_end: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">الوصف التفصيلي (اختياري)</label>
            <textarea 
              className="form-input min-h-[80px]"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        <div className="p-5 border-t border-[hsl(var(--border))] flex justify-end gap-3 bg-[hsl(var(--surface))] rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            إلغاء
          </button>
          <button 
            onClick={() => {
              if (!formData.title) return alert('يرجى إدخال عنوان الهدف')
              if (!formData.target_value) return alert('يرجى إدخال القيمة المستهدفة (أرقام فقط)')
              saveMutation.mutate(formData)
            }}
            disabled={saveMutation.isPending}
            className={`btn-primary ${saveMutation.isPending ? 'opacity-50' : ''}`}
          >
            <Save size={16} />
            {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
      </div>
    </div>
  )
}
