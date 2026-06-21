import { useState } from 'react'
import { X, PlusCircle, Briefcase } from 'lucide-react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface GoalProgressModalProps {
  isOpen: boolean
  onClose: () => void
  goal: any
}

export default function GoalProgressModal({ isOpen, onClose, goal }: GoalProgressModalProps) {
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState('')
  const [projectId, setProjectId] = useState('')

  const { data: projectsData } = useQuery({
    queryKey: ['projects-list'],
    queryFn: () => api.get('/projects', { params: { per_page: 100 } }).then(r => r.data),
    enabled: isOpen
  })

  const projects = projectsData?.data || []

  const updateMutation = useMutation({
    mutationFn: (data: { current_value: number, description?: string }) => {
      return api.put(`/goals/${goal.id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      onClose()
      setAmount('')
      setProjectId('')
    }
  })

  const handleSubmit = () => {
    if (!amount || isNaN(Number(amount))) return

    const addedAmount = Number(amount)
    const newCurrentValue = Number(goal.current_value || 0) + addedAmount
    
    let updatedDescription = goal.description || ''
    if (projectId) {
      const selectedProject = projects.find((p: any) => p.id.toString() === projectId)
      if (selectedProject) {
        const dateStr = new Date().toLocaleDateString('ar-AE')
        const note = `\n- أُضيف مبلغ ${addedAmount} من مشروع: ${selectedProject.name} (بتاريخ ${dateStr})`
        updatedDescription += note
      }
    }

    updateMutation.mutate({ 
      current_value: newCurrentValue,
      description: updatedDescription
    })
  }

  if (!isOpen || !goal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[hsl(var(--background))] border border-[hsl(var(--border))] w-full max-w-md rounded-2xl shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-bold flex items-center gap-2 text-emerald-600">
            <PlusCircle size={20} />
            إضافة إنجاز للهدف
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[hsl(var(--surface))] rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl text-sm">
            أنت تقوم بإضافة إنجاز للهدف: <strong>{goal.title}</strong>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold">المبلغ المنجز / القيمة المضافة</label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                className="form-input flex-1 text-lg font-bold" 
                placeholder="مثال: 5000"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
              <span className="px-4 py-2 bg-[hsl(var(--surface))] rounded-xl font-bold text-[hsl(var(--muted))]">{goal.unit}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Briefcase size={14} className="text-[hsl(var(--muted))]" />
              من مشروع (اختياري لتحويل أرباح مشروع)
            </label>
            <select 
              className="form-input"
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
            >
              <option value="">-- بدون ارتباط بمشروع --</option>
              {projects.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-5 border-t border-[hsl(var(--border))] flex justify-end gap-3 bg-[hsl(var(--surface))] rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2 text-sm font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            إلغاء
          </button>
          <button 
            onClick={handleSubmit}
            disabled={updateMutation.isPending || !amount}
            className="btn-primary"
          >
            {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ الإنجاز'}
          </button>
        </div>
      </div>
    </div>
  )
}
