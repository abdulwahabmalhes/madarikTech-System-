import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Shield, Plus, Edit2, Trash2, Save, X, Check } from 'lucide-react'

export default function RolesPage() {
  const queryClient = useQueryClient()
  const [editingRole, setEditingRole] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', permissions: [] as string[] })

  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => api.get('/roles').then(r => r.data)
  })

  const { data: allPermissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => api.get('/permissions').then(r => r.data)
  })

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingRole) {
        return api.put(`/roles/${editingRole.id}`, data)
      }
      return api.post('/roles', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setIsModalOpen(false)
    },
    onError: (err: any) => {
      alert('حدث خطأ: \n' + (err.response?.data?.message || err.message))
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/roles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
    onError: (err: any) => {
      alert('لا يمكن حذف هذا الدور: \n' + (err.response?.data?.message || err.message))
    }
  })

  const handleEdit = (role: any) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      permissions: role.permissions?.map((p: any) => p.name) || []
    })
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingRole(null)
    setFormData({ name: '', permissions: [] })
    setIsModalOpen(true)
  }

  const togglePermission = (permName: string) => {
    if (formData.permissions.includes(permName)) {
      setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== permName) })
    } else {
      setFormData({ ...formData, permissions: [...formData.permissions, permName] })
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">الأدوار والصلاحيات</h2>
          <p className="text-sm text-[hsl(var(--muted))]">إدارة مهام وصلاحيات الفريق</p>
        </div>
        <button onClick={handleAdd} className="btn-primary">
          <Plus size={16} /> إضافة دور جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role: any) => (
          <div key={role.id} className="glass-card p-5 group relative">
            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(role)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100">
                <Edit2 size={14} />
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من حذف هذا الدور؟')) {
                    deleteMutation.mutate(role.id)
                  }
                }} 
                className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{role.name}</h3>
                <p className="text-xs text-[hsl(var(--muted))]">{role.permissions?.length || 0} صلاحيات مرتبطة</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] w-full max-w-3xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
              <h2 className="text-lg font-bold">{editingRole ? 'تعديل الصلاحيات' : 'دور جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[hsl(var(--surface))] rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-semibold">اسم الدور (مثال: محاسب، مدير مشاريع...)</label>
                <input 
                  type="text" 
                  className="form-input text-lg font-bold" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  disabled={editingRole && ['admin', 'owner'].includes(editingRole.name)}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">حدد الصلاحيات המمنوحة لهذا الدور:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allPermissions.map((perm: any) => (
                    <div 
                      key={perm.id} 
                      onClick={() => togglePermission(perm.name)}
                      className={`cursor-pointer border rounded-xl p-3 flex items-center gap-3 transition-colors ${
                        formData.permissions.includes(perm.name) 
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10' 
                          : 'border-[hsl(var(--border))] hover:bg-[hsl(var(--surface))]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                        formData.permissions.includes(perm.name) ? 'bg-emerald-500 text-white' : 'bg-[hsl(var(--surface))] border border-[hsl(var(--border))]'
                      }`}>
                        {formData.permissions.includes(perm.name) && <Check size={14} />}
                      </div>
                      <span className="text-sm font-medium leading-none">{perm.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[hsl(var(--border))] flex justify-end gap-3 bg-[hsl(var(--surface))] rounded-b-2xl">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-sm font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
                إلغاء
              </button>
              <button 
                onClick={() => {
                  if (!formData.name) return alert('يرجى إدخال اسم الدور')
                  saveMutation.mutate(formData)
                }}
                disabled={saveMutation.isPending}
                className="btn-primary"
              >
                <Save size={16} />
                {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
