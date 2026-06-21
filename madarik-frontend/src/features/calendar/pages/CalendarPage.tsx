import { useState } from 'react'
import { CalendarDays, Plus, Clock, Video, Edit2, Trash2, Phone, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import CalendarEventFormModal from '../components/CalendarEventFormModal'

const TYPE_MAP: Record<string, { label: string; icon: any; color: string }> = {
  'meeting': { label: 'اجتماع', icon: Video, color: 'text-emerald-600 bg-emerald-50' },
  'call': { label: 'مكالمة', icon: Phone, color: 'text-emerald-600 bg-emerald-50' },
  'task': { label: 'مهمة', icon: Briefcase, color: 'text-green-600 bg-green-50' },
  'event': { label: 'فعالية', icon: CalendarDays, color: 'text-amber-600 bg-amber-50' },
}

export default function CalendarPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<any>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar'],
    queryFn: () => api.get('/calendar').then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/calendar/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calendar'] })
  })

  const handleEdit = (event: any) => {
    setEventToEdit(event)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEventToEdit(null)
    setSelectedDate(null)
    setIsModalOpen(true)
  }

  const handleAddDate = (date: Date) => {
    setEventToEdit(null)
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const days = getDaysInMonth(currentDate)
  const weekDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const goToToday = () => setCurrentDate(new Date())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">التقويم وجدولة المواعيد</h2>
          <p className="text-[hsl(var(--muted))] mt-1">متابعة المواعيد، المهام، والاجتماعات المجدولة</p>
        </div>
        <button onClick={handleAdd} className="btn-primary"><Plus size={16} /> إضافة حدث جديد</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 flex flex-col min-h-[500px]">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[hsl(var(--foreground))]">
              {currentDate.toLocaleDateString('ar-AE', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors">
                <ChevronRight size={18} />
              </button>
              <button onClick={goToToday} className="px-3 py-1.5 text-sm font-medium border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors">
                اليوم
              </button>
              <button onClick={nextMonth} className="p-2 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors">
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-7 gap-px bg-[hsl(var(--border))] rounded-t-xl overflow-hidden border border-[hsl(var(--border))]">
              {weekDays.map(day => (
                <div key={day} className="bg-[hsl(var(--surface))] py-2 text-center text-xs font-semibold text-[hsl(var(--muted))]">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-px bg-[hsl(var(--border))] border-x border-b border-[hsl(var(--border))] rounded-b-xl overflow-hidden flex-1">
              {days.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="bg-[hsl(var(--surface))] min-h-[100px] opacity-50" />
                }

                const isToday = new Date().toDateString() === date.toDateString()
                const dayEvents = (events || []).filter((e: any) => new Date(e.start_at).toDateString() === date.toDateString())

                return (
                  <div 
                    key={date.toISOString()} 
                    onClick={() => handleAddDate(date)}
                    className="bg-[hsl(var(--surface))] min-h-[100px] p-1.5 flex flex-col group cursor-pointer hover:bg-[hsl(var(--surface-hover))] transition-colors relative"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-emerald-500 text-white font-bold' : 'text-[hsl(var(--foreground))] group-hover:text-emerald-600'}`}>
                        {date.getDate()}
                      </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {dayEvents.map((event: any) => {
                        const config = TYPE_MAP[event.type] || TYPE_MAP['meeting']
                        return (
                          <div 
                            key={event.id}
                            onClick={(e) => { e.stopPropagation(); handleEdit(event); }}
                            className={`text-[10px] p-1 rounded truncate border transition-all hover:scale-[1.02] cursor-pointer ${config.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-20 ')}`}
                            title={event.title}
                          >
                            <span className="font-semibold">{new Date(event.start_at).toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })}</span> - {event.title}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-[hsl(var(--foreground))]">الأحداث والمواعيد القادمة</h4>
            </div>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-[hsl(var(--surface))] rounded-xl animate-pulse" />)}
              </div>
            ) : events?.length > 0 ? (
              <div className="space-y-3">
                {events.map((event: any) => {
                  const config = TYPE_MAP[event.type] || TYPE_MAP['meeting']
                  const Icon = config.icon
                  const startDate = new Date(event.start_at)

                  return (
                    <div key={event.id} className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] relative group">
                      <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(event)} className="p-1 text-emerald-500 hover:bg-emerald-50 rounded">
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm('هل أنت متأكد من الحذف؟')) deleteMutation.mutate(event.id)
                          }} 
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="flex gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 h-10 w-10 flex items-center justify-center ${config.color}`}>
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1 pr-6">
                          <div className="text-sm font-bold text-[hsl(var(--foreground))] truncate">{event.title}</div>
                          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 mt-1.5">
                            <Clock size={12} /> {startDate.toLocaleString('ar-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                          </div>
                          {event.description && (
                            <div className="text-xs text-[hsl(var(--muted))] mt-2 line-clamp-2">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-[hsl(var(--muted))] mb-4">لا توجد مواعيد قادمة.</p>
                <button onClick={handleAdd} className="btn-secondary w-full text-xs">إضافة موعد جديد</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CalendarEventFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventToEdit={eventToEdit}
        initialDate={selectedDate}
      />
    </div>
  )
}

