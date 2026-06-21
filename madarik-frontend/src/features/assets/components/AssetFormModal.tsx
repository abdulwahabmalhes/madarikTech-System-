import { useState, useEffect } from 'react'
import { X, Save, HardDrive } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

interface AssetFormModalProps {
  isOpen: boolean
  onClose: () => void
  assetToEdit?: any
}

export default function AssetFormModal({ isOpen, onClose, assetToEdit }: AssetFormModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    type: 'laptop',
    provider: '',
    purchase_date: '',
    notes: '',
  })

  useEffect(() => {
    if (assetToEdit) {
      setFormData({
        name: assetToEdit.name || '',
        type: assetToEdit.type || 'laptop',
        provider: assetToEdit.provider || '',
        purchase_date: assetToEdit.purchase_date?.split('T')[0] || '',
        notes: assetToEdit.notes || '',
      })
    } else {
      setFormData({
        name: '',
        type: 'laptop',
        provider: '',
        purchase_date: '',
        notes: '',
      })
    }
  }, [assetToEdit, isOpen])

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (assetToEdit) {
        return api.put(`/assets/${assetToEdit.id}`, data)
      }
      return api.post('/assets', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      onClose()
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <HardDrive size={18} className="text-emerald-500" />
            {assetToEdit ? 'تعديل الأصل' : 'تسجيل أصل جديد'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--surface))] rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold">اسم / موديل الجهاز</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="مثال: MacBook Pro M2"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">نوع الأصل</label>
              <select 
                className="form-input"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="laptop">جهاز محمول (Laptop)</option>
                <option value="mobile">هاتف ذكي</option>
                <option value="monitor">شاشة عرض</option>
                <option value="other">أخرى</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">المزود / المورد</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="مثال: Apple Store"
                value={formData.provider}
                onChange={e => setFormData({...formData, provider: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">تاريخ الشراء</label>
            <input 
              type="date" 
              className="form-input"
              value={formData.purchase_date}
              onChange={e => setFormData({...formData, purchase_date: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">ملاحظات (اختياري)</label>
            <textarea 
              className="form-input min-h-[80px]"
              placeholder="الرقم التسلسلي أو أية تفاصيل إضافية..."
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
            disabled={saveMutation.isPending || !formData.name}
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
