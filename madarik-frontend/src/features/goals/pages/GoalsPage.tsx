import { useState } from 'react'
import { Target, Plus, Edit2, Trash2, PlusCircle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import GoalFormModal from '../components/GoalFormModal'
import GoalProgressModal from '../components/GoalProgressModal'

export default function GoalsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [goalToEdit, setGoalToEdit] = useState<any>(null)
  
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false)
  const [goalToProgress, setGoalToProgress] = useState<any>(null)

  const { data: goals, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => api.get('/goals').then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/goals/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['goals'] })
  })

  const handleEdit = (goal: any) => {
    setGoalToEdit(goal)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setGoalToEdit(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">الأهداف والمؤشرات</h2>
          <p className="text-[hsl(var(--muted))] mt-1">تتبع أهداف الشركة ومؤشرات الأداء الرئيسية (KPIs)</p>
        </div>
        <button onClick={handleAdd} className="btn-primary"><Plus size={16} /> إضافة هدف جديد</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card h-40 animate-pulse" />)}
        </div>
      ) : goals?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal: any) => {
            const target = Number(goal.target_value) || 0
            const current = Number(goal.current_value) || 0
            const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0

            return (
              <div key={goal.id} className="glass-card p-6 relative group flex flex-col justify-between">
                <div>
                  <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(goal)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100">
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('هل أنت متأكد من حذف هذا الهدف؟')) deleteMutation.mutate(goal.id)
                      }} 
                      className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 text-emerald-600">
                      <Target size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[hsl(var(--foreground))]">{goal.title}</h3>
                      <div className="text-xs text-[hsl(var(--muted))] flex items-center gap-1 mt-1 font-medium bg-[hsl(var(--surface))] inline-flex px-2 py-1 rounded-md">
                        {goal.period_start} إلى {goal.period_end}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-semibold text-[hsl(var(--muted))]">نسبة الإنجاز</span>
                        <span className={`text-2xl font-black ${percentage >= 100 ? 'text-green-500' : 'text-emerald-600'}`}>{percentage}%</span>
                      </div>
                      <div className="h-3 bg-[hsl(var(--surface))] rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${percentage >= 100 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'}`} 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-[hsl(var(--surface))] p-3 rounded-xl border border-[hsl(var(--border))]">
                      <div className="text-center w-1/2 border-l border-[hsl(var(--border))]">
                        <div className="text-[10px] text-[hsl(var(--muted))] font-bold uppercase mb-1">المنجز حالياً</div>
                        <div className="font-bold text-emerald-600">{current.toLocaleString('ar-AE')} <span className="text-[10px]">{goal.unit}</span></div>
                      </div>
                      <div className="text-center w-1/2">
                        <div className="text-[10px] text-[hsl(var(--muted))] font-bold uppercase mb-1">الهدف المطلوب</div>
                        <div className="font-bold text-[hsl(var(--foreground))]">{target.toLocaleString('ar-AE')} <span className="text-[10px]">{goal.unit}</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setGoalToProgress(goal)
                    setIsProgressModalOpen(true)
                  }}
                  className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-emerald-100 dark:border-emerald-800/30"
                >
                  <PlusCircle size={18} />
                  تسجيل إنجاز أو تحويل من مشروع
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Target size={48} className="mx-auto text-[hsl(var(--muted))] mb-4 opacity-20" />
          <h3 className="text-lg font-bold text-[hsl(var(--foreground))] mb-2">لا توجد أهداف مسجلة</h3>
          <p className="text-[hsl(var(--muted))] max-w-md mx-auto">قم بتحديد أهداف المبيعات، الإيرادات، والمشاريع لمتابعة أداء فريقك.</p>
          <button onClick={handleAdd} className="btn-primary mx-auto mt-6 px-6 py-2">أضف أول هدف</button>
        </div>
      )}

      <GoalFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goalToEdit={goalToEdit}
      />

      <GoalProgressModal 
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        goal={goalToProgress}
      />
    </div>
  )
}
