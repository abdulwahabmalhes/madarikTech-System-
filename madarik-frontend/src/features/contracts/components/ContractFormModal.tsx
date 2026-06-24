import { useState, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import { useNavigate } from 'react-router-dom'

interface ContractFormModalProps {
  isOpen: boolean
  onClose: () => void
  contractToEdit?: any | null
}

export function ContractFormModal({ isOpen, onClose, contractToEdit }: ContractFormModalProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    client_id: '',
    project_id: '',
    value: '',
    start_date: '',
    end_date: '',
    status: 'draft',
    content: ''
  })

  // Load clients and projects for dropdowns
  const { data: clientsData } = useQuery({
    queryKey: ['clients-list'],
    queryFn: () => api.get('/clients?per_page=100').then(r => r.data),
    enabled: isOpen
  })
  const clients = clientsData?.data || []

  const { data: projectsData } = useQuery({
    queryKey: ['projects-list'],
    queryFn: () => api.get('/projects?per_page=100').then(r => r.data),
    enabled: isOpen
  })
  const projects = projectsData?.data || []

  useEffect(() => {
    if (contractToEdit) {
      setFormData({
        title: contractToEdit.title || '',
        client_id: contractToEdit.client_id?.toString() || '',
        project_id: contractToEdit.project_id?.toString() || '',
        value: contractToEdit.value || '',
        start_date: contractToEdit.start_date || '',
        end_date: contractToEdit.end_date || '',
        status: contractToEdit.status || 'draft',
        content: contractToEdit.content || ''
      })
    } else {
      setFormData({
        title: '',
        client_id: '',
        project_id: '',
        value: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        status: 'draft',
        content: ''
      })
    }
  }, [contractToEdit, isOpen])

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = { ...data }
      if (!payload.project_id) delete payload.project_id
      if (!payload.client_id) delete payload.client_id
      if (!payload.start_date) payload.start_date = null
      if (!payload.end_date) payload.end_date = null
      if (!payload.content) payload.content = null

      if (contractToEdit) {
        return api.put(`/contracts/${contractToEdit.id}`, payload).then(r => r.data)
      }
      return api.post('/contracts', payload).then(r => r.data)
    },
    onSuccess: (newContract) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      if (contractToEdit) {
        queryClient.invalidateQueries({ queryKey: ['contract', contractToEdit.id] })
      }
      onClose()
      if (!contractToEdit && newContract?.id) {
        navigate(`/contracts/${newContract.id}`)
      }
    },
    onError: (err: any) => {
      const serverMsg = err.response?.data?.error || err.response?.data?.message
      if (serverMsg) {
        alert('رسالة من السيرفر: \n' + serverMsg)
      } else {
        alert('حدث خطأ أثناء حفظ العقد. يرجى التأكد من تعبئة جميع الحقول المطلوبة (كالعنوان والقيمة والعميل).')
      }
      console.error(err)
    }
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={contractToEdit ? 'تعديل العقد' : 'إنشاء عقد جديد'} size="xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">عنوان العقد *</label>
          <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="form-input" placeholder="مثال: عقد تصميم وبرمجة" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">العميل *</label>
            <select required value={formData.client_id} onChange={e => setFormData({ ...formData, client_id: e.target.value })} className="form-input">
              <option value="">-- اختر العميل --</option>
              {clients.map((c: any) => (
                <option key={c.id} value={c.id}>{c.company_name || c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">المشروع (اختياري)</label>
            <select value={formData.project_id} onChange={e => setFormData({ ...formData, project_id: e.target.value })} className="form-input">
              <option value="">-- بدون مشروع --</option>
              {projects.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">قيمة العقد *</label>
            <input required type="number" step="0.01" value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} className="form-input" placeholder="0.00" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">حالة العقد</label>
            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="form-input">
              <option value="draft">مسودة</option>
              <option value="active">نشط</option>
              <option value="completed">منتهي</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">تاريخ البدء</label>
            <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} className="form-input" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">تاريخ الانتهاء</label>
            <input type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} className="form-input" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1.5">محتوى العقد / الشروط</label>
          <textarea rows={6} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="form-input resize-y" placeholder="اكتب بنود العقد هنا..."></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[hsl(var(--border))]">
          <button className="btn-secondary" onClick={onClose}>إلغاء</button>
          <button 
            className="btn-primary" 
            onClick={() => saveMutation.mutate(formData)}
            disabled={saveMutation.isPending || !formData.title || !formData.client_id || !formData.value}
          >
            {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ العقد'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
