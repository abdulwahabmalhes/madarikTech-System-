import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'

export default function CashFlowPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['cash-flow'],
    queryFn: () => api.get('/analytics/cash-flow').then(r => r.data),
  })

  const inflows = data?.inflows || 0;
  const outflows = data?.outflows || 0;
  const currentBalance = data?.current_balance || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">التدفق النقدي</h2>
        <p className="text-[hsl(var(--muted))] mt-1">مراقبة حركة الأموال الداخلة والخارجة</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 border-b-4 border-emerald-500">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[hsl(var(--muted))] font-medium text-sm">الرصيد الحالي</div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{Number(currentBalance).toLocaleString('ar-AE')} <span className="text-sm font-normal opacity-70">د.إ</span></div>
        </div>
        <div className="glass-card p-5 border-b-4 border-emerald-500">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[hsl(var(--muted))] font-medium text-sm">التدفقات الداخلة</div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{Number(inflows).toLocaleString('ar-AE')} <span className="text-sm font-normal opacity-70">د.إ</span></div>
        </div>
        <div className="glass-card p-5 border-b-4 border-rose-500">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[hsl(var(--muted))] font-medium text-sm">التدفقات الخارجة</div>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ArrowDownRight size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">{Number(outflows).toLocaleString('ar-AE')} <span className="text-sm font-normal opacity-70">د.إ</span></div>
        </div>
      </div>

      <div className="glass-card p-12 text-center">
        <TrendingUp size={48} className="mx-auto text-[hsl(var(--muted))] mb-4 opacity-20" />
        <h3 className="text-lg font-bold text-[hsl(var(--foreground))] mb-2">لا توجد حركات مالية مسجلة بعد</h3>
        <p className="text-[hsl(var(--muted))] max-w-md mx-auto">عند تسجيل فواتير مدفوعة أو مصروفات، ستظهر لك هنا تحليلات مفصلة للتدفق النقدي الخاص بشركتك.</p>
      </div>
    </div>
  )
}

