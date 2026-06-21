import { useState, useEffect } from 'react'
import { X, Save, BookOpen } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

interface KnowledgeFormModalProps {
  isOpen: boolean
  onClose: () => void
  articleToEdit?: any
}

export default function KnowledgeFormModal({ isOpen, onClose, articleToEdit }: KnowledgeFormModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_published: true,
  })

  useEffect(() => {
    if (articleToEdit) {
      setFormData({
        title: articleToEdit.title || '',
        content: articleToEdit.content || '',
        is_published: articleToEdit.is_published ?? true,
      })
    } else {
      setFormData({
        title: '',
        content: '',
        is_published: true,
      })
    }
  }, [articleToEdit, isOpen])

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (articleToEdit) {
        return api.put(`/knowledge/${articleToEdit.id}`, data)
      }
      return api.post('/knowledge', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] })
      onClose()
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] w-full max-w-3xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-500" />
            {articleToEdit ? 'تعديل المقالة' : 'إضافة مقالة جديدة'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--surface))] rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold">عنوان المقالة / المستند</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="مثال: سياسة الإجازات السنوية..."
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">محتوى المقالة</label>
            <textarea 
              className="form-input min-h-[300px]"
              placeholder="اكتب المحتوى هنا..."
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              checked={formData.is_published}
              onChange={e => setFormData({...formData, is_published: e.target.checked})}
            />
            <span className="text-sm font-medium">نشر المقالة فوراً (متاحة للجميع)</span>
          </label>
        </div>

        <div className="p-5 border-t border-[hsl(var(--border))] flex justify-end gap-3 bg-[hsl(var(--surface))] rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            إلغاء
          </button>
          <button 
            onClick={() => saveMutation.mutate(formData)}
            disabled={saveMutation.isPending || !formData.title || !formData.content}
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
