import { useState, useEffect } from 'react'
import { X, Save, Calendar as CalendarIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

interface CalendarEventFormModalProps {
  isOpen: boolean
  onClose: () => void
  eventToEdit?: any
  initialDate?: Date | null
}

export default function CalendarEventFormModal({ isOpen, onClose, eventToEdit, initialDate }: CalendarEventFormModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'meeting',
    start_at: '',
    end_at: '',
  })

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || '',
        description: eventToEdit.description || '',
        type: eventToEdit.type || 'meeting',
        start_at: eventToEdit.start_at?.slice(0, 16) || '', // YYYY-MM-DDTHH:mm format
        end_at: eventToEdit.end_at?.slice(0, 16) || '',
      })
    } else {
      const start = initialDate ? new Date(initialDate) : new Date()
      // If initialDate is a specific day from calendar, it might be 00:00. Let's set it to current time on that day for convenience.
      if (initialDate && start.getHours() === 0) {
        const now = new Date()
        start.setHours(now.getHours(), now.getMinutes())
      }
      start.setMinutes(start.getMinutes() - start.getTimezoneOffset())
      const formattedStart = start.toISOString().slice(0, 16)
      
      const later = new Date(start)
      later.setHours(later.getHours() + 1)
      const formattedLater = later.toISOString().slice(0, 16)

      setFormData({
        title: '',
        description: '',
        type: 'meeting',
        start_at: formattedStart,
        end_at: formattedLater,
      })
    }
  }, [eventToEdit, initialDate, isOpen])

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (eventToEdit) {
        return api.put(`/calendar/${eventToEdit.id}`, data)
      }
      return api.post('/calendar', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] })
      onClose()
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <CalendarIcon size={18} className="text-emerald-500" />
            {eventToEdit ? 'تعديل الحدث' : 'إضافة حدث جديد'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--surface))] rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold">عنوان الحدث</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="مثال: اجتماع مع فريق التطوير..."
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">نوع الحدث</label>
            <select 
              className="form-input"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="meeting">اجتماع</option>
              <option value="call">مكالمة</option>
              <option value="task">مهمة</option>
              <option value="event">فعالية</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">يبدأ في</label>
              <input 
                type="datetime-local" 
                className="form-input text-left" dir="ltr"
                value={formData.start_at}
                onChange={e => setFormData({...formData, start_at: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">ينتهي في</label>
              <input 
                type="datetime-local" 
                className="form-input text-left" dir="ltr"
                value={formData.end_at}
                onChange={e => setFormData({...formData, end_at: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">وصف الحدث (اختياري)</label>
            <textarea 
              className="form-input min-h-[100px]"
              placeholder="أية تفاصيل إضافية..."
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
            onClick={() => saveMutation.mutate(formData)}
            disabled={saveMutation.isPending || !formData.title || !formData.start_at}
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
