import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Users, Plus, Mail, Phone, Shield, UserCheck, Trash2, Edit2 } from 'lucide-react'
import TeamFormModal from '../components/TeamFormModal'

const ROLE_MAP: Record<string, { label: string; badge: string }> = {
  'owner':           { label: 'المالك',          badge: 'badge-purple' },
  'super-admin':     { label: 'مسؤول رئيسي',    badge: 'badge-danger' },
  'sales-manager':   { label: 'مدير مبيعات',    badge: 'badge-info' },
  'project-manager': { label: 'مدير مشاريع',    badge: 'badge-warning' },
  'accountant':      { label: 'محاسب',           badge: 'badge-success' },
  'employee':        { label: 'موظف',            badge: 'badge-gray' },
  'client':          { label: 'عميل',            badge: 'badge-gray' },
}

export default function TeamPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [memberToEdit, setMemberToEdit] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: () => api.get('/team').then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/team/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team'] })
  })

  const members = data ?? []

  const handleEdit = (member: any) => {
    setMemberToEdit(member)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setMemberToEdit(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">الفريق</h2>
          <p className="text-sm text-[hsl(var(--muted))]">{members.length} عضو</p>
        </div>
        <button onClick={handleAdd} className="btn-primary"><Plus size={16} /> دعوة عضو</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card h-40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member: any) => {
            const roles: any[] = member.roles ?? []
            const firstRole = roles[0]
            const primaryRole = typeof firstRole === 'string' ? firstRole : (firstRole?.name ?? 'بدون صلاحية')
            const roleInfo = { label: primaryRole, badge: 'badge-gray' }

            return (
              <div key={member.id} className="glass-card p-5 group relative">
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(member)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100">
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من حذف هذا العضو؟')) {
                        deleteMutation.mutate(member.id)
                      }
                    }} 
                    className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="min-w-0 pr-8">
                    <div className="font-semibold text-[hsl(var(--foreground))] truncate">{member.name}</div>
                    <div className="text-xs text-[hsl(var(--muted))] truncate">{member.position ?? member.department ?? '—'}</div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  {member.email && (
                    <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted))] truncate">
                      <Mail size={12} /> {member.email}
                    </div>
                  )}
                  {member.mobile && (
                    <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted))]" dir="ltr">
                      <Phone size={12} /> {member.mobile}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${roleInfo.badge}`}>
                    <Shield size={10} /> {roleInfo.label}
                  </span>
                  <span className={`text-xs flex items-center gap-1 ${member.is_active ? 'text-emerald-600' : 'text-[hsl(var(--muted))]'}`}>
                    <UserCheck size={12} />
                    {member.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!isLoading && members.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Users size={40} className="mx-auto text-[hsl(var(--muted))] mb-3 opacity-40" />
          <p className="text-[hsl(var(--muted))]">لا يوجد أعضاء فريق</p>
        </div>
      )}

      <TeamFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        memberToEdit={memberToEdit} 
      />
    </div>
  )
}
