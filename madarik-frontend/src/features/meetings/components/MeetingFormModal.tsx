import { useState, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import api from '@/lib/api'

interface MeetingFormModalProps {
  meeting?: any
  onClose: () => void
}

export function MeetingFormModal({ meeting, onClose }: MeetingFormModalProps) {
  const queryClient = useQueryClient()
  const isEditing = !!meeting

  const { data: clientsRes } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get('/clients', { params: { per_page: 100 } }).then(r => r.data)
  })

  const { data: projectsRes } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects', { params: { per_page: 100 } }).then(r => r.data)
  })

  const clients = clientsRes?.data || []
  const projects = projectsRes?.data || []

  const [formData, setFormData] = useState({
    title: '',
    type: 'online',
    client_id: '',
    project_id: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '11:00',
    location: '',
    status: 'scheduled',
    external_attendees: '',
  })

  useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title || '',
        type: meeting.type || 'online',
        client_id: meeting.client_id || '',
        project_id: meeting.project_id || '',
        date: meeting.date ? meeting.date.split('T')[0] : '',
        start_time: meeting.start_time || '',
        end_time: meeting.end_time || '',
        location: meeting.location || '',
        status: meeting.status || 'scheduled',
        external_attendees: meeting.external_attendees || '',
      })
    }
  }, [meeting])

  const saveMutation = useMutation({
    mutationFn: (payload: any) => 
      isEditing 
        ? api.put(`/meetings/${meeting.id}`, payload).then(r => r.data)
        : api.post('/meetings', payload).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
      onClose()
    },
    onError: (err: any) => {
      alert('حدث خطأ أثناء حفظ الاجتماع. تأكد من إدخال جميع البيانات المطلوبة.')
      console.error(err)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clean payload: Remove empty strings for foreign keys
    const payload = { ...formData }
    if (!payload.client_id) delete (payload as any).client_id
    if (!payload.project_id) delete (payload as any).project_id
    
    saveMutation.mutate(payload)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEditing ? 'تعديل الاجتماع' : 'جدولة اجتماع جديد'}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">موضوع الاجتماع *</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="form-input" placeholder="مثال: مناقشة متطلبات المشروع" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">العميل</label>
              <select value={formData.client_id} onChange={e => setFormData({ ...formData, client_id: e.target.value })} className="form-input">
                <option value="">-- بدون عميل --</option>
                {clients.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.company_name || c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">المشروع</label>
              <select value={formData.project_id} onChange={e => setFormData({ ...formData, project_id: e.target.value })} className="form-input">
                <option value="">-- عام --</option>
                {projects.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">حالة الاجتماع</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="form-input">
                <option value="scheduled">مجدول</option>
                <option value="postponed">مؤجل</option>
                <option value="done">تم الانتهاء</option>
                <option value="cancelled">ملغي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">مع من سيتم الاجتماع؟</label>
              <input value={formData.external_attendees} onChange={e => setFormData({ ...formData, external_attendees: e.target.value })} className="form-input" placeholder="مثال: لحالي، شركة وسيطة، اسم الشخص..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">نوع الاجتماع</label>
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="form-input">
                <option value="online">أونلاين (عن بعد)</option>
                <option value="in_person">حضوري</option>
                <option value="phone">هاتفي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">رابط / مكان الاجتماع</label>
              <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="form-input" placeholder={formData.type === 'online' ? 'رابط Zoom أو Meet' : 'مقر الشركة'} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">تاريخ الاجتماع *</label>
              <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="form-input" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">وقت البدء *</label>
                <input required type="time" value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">وقت الانتهاء</label>
                <input type="time" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} className="form-input" />
              </div>
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3 bg-gray-50 dark:bg-slate-800/50">
          <button type="button" onClick={onClose} className="btn-secondary">إلغاء</button>
          <button onClick={handleSubmit} disabled={saveMutation.isPending} className="btn-primary">
            {saveMutation.isPending ? 'جاري الحفظ...' : (isEditing ? 'حفظ التعديلات' : 'جدولة الاجتماع')}
          </button>
        </div>
      </div>
    </div>
  )
}
