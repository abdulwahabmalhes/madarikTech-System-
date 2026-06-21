import { useState, useEffect } from 'react'
import { X, Save, Shield } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

interface TeamFormModalProps {
  isOpen: boolean
  onClose: () => void
  memberToEdit?: any
}

const ROLES = [
  { id: 'employee', label: 'موظف' },
  { id: 'accountant', label: 'محاسب' },
  { id: 'project-manager', label: 'مدير مشاريع' },
  { id: 'sales-manager', label: 'مدير مبيعات' },
  { id: 'super-admin', label: 'مسؤول رئيسي' },
]

export default function TeamFormModal({ isOpen, onClose, memberToEdit }: TeamFormModalProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',
    position: '',
    role: 'employee',
  })

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        name: memberToEdit.name || '',
        email: memberToEdit.email || '',
        mobile: memberToEdit.mobile || '',
        department: memberToEdit.department || '',
        position: memberToEdit.position || '',
        role: memberToEdit.roles?.[0]?.name || 'employee',
      })
    } else {
      setFormData({
        name: '',
        email: '',
        mobile: '',
        department: '',
        position: '',
        role: 'employee',
      })
    }
  }, [memberToEdit, isOpen])

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (memberToEdit) {
        return api.put(`/team/${memberToEdit.id}`, data)
      }
      return api.post('/team/invite', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
      onClose()
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Shield size={18} className="text-emerald-500" />
            {memberToEdit ? 'تعديل بيانات العضو' : 'دعوة عضو جديد'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--surface))] rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold">الاسم بالكامل</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">البريد الإلكتروني</label>
              <input 
                type="email" 
                className="form-input text-left" dir="ltr"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">رقم الجوال</label>
              <input 
                type="text" 
                className="form-input text-left" dir="ltr"
                value={formData.mobile}
                onChange={e => setFormData({...formData, mobile: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">القسم</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">المسمى الوظيفي</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.position}
                onChange={e => setFormData({...formData, position: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">الصلاحية (الدور)</label>
            <select 
              className="form-input"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              {ROLES.map(role => (
                <option key={role.id} value={role.id}>{role.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-5 border-t border-[hsl(var(--border))] flex justify-end gap-3 bg-[hsl(var(--surface))] rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            إلغاء
          </button>
          <button 
            onClick={() => saveMutation.mutate(formData)}
            disabled={saveMutation.isPending || !formData.name || !formData.email}
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
