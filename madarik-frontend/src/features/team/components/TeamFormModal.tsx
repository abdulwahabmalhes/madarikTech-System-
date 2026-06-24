import { useState, useEffect } from 'react'
import { X, Save, Shield } from 'lucide-react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface TeamFormModalProps {
  isOpen: boolean
  onClose: () => void
  memberToEdit?: any
}

export default function TeamFormModal({ isOpen, onClose, memberToEdit }: TeamFormModalProps) {
  const queryClient = useQueryClient()
  
  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: () => api.get('/roles').then(r => r.data),
    enabled: isOpen
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',
    position: '',
    role: '',
    password: '',
  })

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        name: memberToEdit.name || '',
        email: memberToEdit.email || '',
        mobile: memberToEdit.mobile || '',
        department: memberToEdit.department || '',
        position: memberToEdit.position || '',
        role: (typeof memberToEdit.roles?.[0] === 'string' ? memberToEdit.roles[0] : memberToEdit.roles?.[0]?.name) || '',
        password: '',
      })
    } else {
      setFormData({
        name: '',
        email: '',
        mobile: '',
        department: '',
        position: '',
        role: roles.length > 0 ? roles[0].name : '',
        password: '',
      })
    }
  }, [memberToEdit, isOpen, roles])

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = { ...data }
      if (!payload.password) delete payload.password
      
      if (memberToEdit) {
        return api.put(`/team/${memberToEdit.id}`, payload)
      }
      return api.post('/team', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold">الصلاحية (الدور)</label>
              <select 
                className="form-input"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="" disabled>اختر الصلاحية...</option>
                {roles.map((role: any) => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold">كلمة المرور {memberToEdit && '(اتركه فارغاً لعدم التغيير)'}</label>
              <input 
                type="password" 
                className="form-input text-left" dir="ltr"
                placeholder={memberToEdit ? '********' : 'كلمة المرور...'}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-[hsl(var(--border))] flex justify-end gap-3 bg-[hsl(var(--surface))] rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            إلغاء
          </button>
          <button 
            onClick={() => {
              if (!formData.name || !formData.email || !formData.role) return alert('يرجى إدخال الاسم والإيميل والدور')
              if (!memberToEdit && !formData.password) return alert('يرجى تعيين كلمة مرور للعضو الجديد')
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
