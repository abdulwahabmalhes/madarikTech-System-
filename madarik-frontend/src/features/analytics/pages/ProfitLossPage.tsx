import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Activity, Briefcase, PieChart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts'
import { Link } from 'react-router-dom'

export default function ProfitLossPage() {
  const { data: invoicesData, isLoading: loadingInvoices } = useQuery({
    queryKey: ['all-invoices'],
    queryFn: () => api.get('/invoices', { params: { per_page: 10000 } }).then(r => r.data)
  })

  const { data: expensesData, isLoading: loadingExpenses } = useQuery({
    queryKey: ['all-expenses'],
    queryFn: () => api.get('/expenses', { params: { per_page: 10000 } }).then(r => r.data)
  })

  const { data: incomesData, isLoading: loadingIncomes } = useQuery({
    queryKey: ['all-incomes'],
    queryFn: () => api.get('/incomes', { params: { per_page: 10000 } }).then(r => r.data)
  })

  const { data: projectsData, isLoading: loadingProjects } = useQuery({
    queryKey: ['all-projects'],
    queryFn: () => api.get('/projects', { params: { per_page: 10000 } }).then(r => r.data)
  })

  if (loadingInvoices || loadingExpenses || loadingProjects || loadingIncomes) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>)}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl"></div>
      </div>
    )
  }

  const invoices = invoicesData?.data || []
  const expenses = expensesData?.data || []
  const incomes = incomesData?.data || []
  const projects = projectsData?.data || []

  // Global calculations
  const invoiceCollectedRevenue = invoices.reduce((sum: number, inv: any) => {
    const total = Number(inv.total) || 0
    const remaining = Number(inv.remaining_amount ?? total)
    // If status is paid, assume all collected. Otherwise use total - remaining
    if (inv.status === 'paid') return sum + total
    return sum + Math.max(0, total - remaining)
  }, 0)

  const independentIncomes = incomes.reduce((sum: number, inc: any) => sum + (Number(inc.amount) || 0), 0)
  
  const collectedRevenue = invoiceCollectedRevenue + independentIncomes

  const pendingRevenue = invoices.reduce((sum: number, inv: any) => {
    if (inv.status === 'paid') return sum
    const total = Number(inv.total) || 0
    const remaining = Number(inv.remaining_amount ?? total)
    return sum + remaining
  }, 0)

  const totalRevenue = collectedRevenue + pendingRevenue
  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + (Number(exp.amount) || 0), 0)
  
  const actualProfit = collectedRevenue - totalExpenses
  const expectedProfit = totalRevenue - totalExpenses

  // Monthly Data for charts
  const monthlyStats: Record<string, { month: string, name: string, revenues: number, expenses: number, profit: number }> = {}

  // Process invoices for monthly revenues
  invoices.forEach((inv: any) => {
    if (!inv.issue_date) return
    const d = new Date(inv.issue_date)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthName = d.toLocaleDateString('ar-AE', { year: 'numeric', month: 'short' })
    
    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = { month: monthKey, name: monthName, revenues: 0, expenses: 0, profit: 0 }
    }
    monthlyStats[monthKey].revenues += Number(inv.total) || 0
  })

  // Process generic incomes for monthly revenues
  incomes.forEach((inc: any) => {
    if (!inc.date) return
    const d = new Date(inc.date)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthName = d.toLocaleDateString('ar-AE', { year: 'numeric', month: 'short' })
    
    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = { month: monthKey, name: monthName, revenues: 0, expenses: 0, profit: 0 }
    }
    monthlyStats[monthKey].revenues += Number(inc.amount) || 0
  })

  // Process expenses
  expenses.forEach((exp: any) => {
    if (!exp.date) return
    const d = new Date(exp.date)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthName = d.toLocaleDateString('ar-AE', { year: 'numeric', month: 'short' })
    
    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = { month: monthKey, name: monthName, revenues: 0, expenses: 0, profit: 0 }
    }
    monthlyStats[monthKey].expenses += Number(exp.amount) || 0
  })

  // Calculate monthly profit and prepare array
  const chartData = Object.values(monthlyStats)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(stat => ({
      ...stat,
      profit: stat.revenues - stat.expenses
    }))

  // Process Project Stats
  const projectStats = projects.map((project: any) => {
    const projInvoices = invoices.filter((inv: any) => inv.project_id === project.id)
    const projExpenses = expenses.filter((exp: any) => exp.project_id === project.id)
    const projIncomes = incomes.filter((inc: any) => inc.project_id === project.id)

    const invoiceRevenues = projInvoices.reduce((sum: number, inv: any) => {
      const total = Number(inv.total) || 0
      const remaining = Number(inv.remaining_amount ?? total)
      if (inv.status === 'paid') return sum + total
      return sum + Math.max(0, total - remaining)
    }, 0)

    const independentProjIncomes = projIncomes.reduce((sum: number, inc: any) => sum + (Number(inc.amount) || 0), 0)
    
    const revenues = invoiceRevenues + independentProjIncomes

    const costs = projExpenses.reduce((sum: number, exp: any) => sum + (Number(exp.amount) || 0), 0)
    
    const profit = revenues - costs
    const margin = revenues > 0 ? (profit / revenues) * 100 : 0

    return {
      ...project,
      revenues,
      costs,
      profit,
      margin
    }
  }).sort((a: any, b: any) => b.profit - a.profit)

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">تقرير الأرباح والخسائر</h2>
        <p className="text-[hsl(var(--muted))] mt-1">نظرة شاملة على الأداء المالي للشركة</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Actual Profit */}
        <div className={`glass-card p-5 border-b-4 ${actualProfit >= 0 ? 'border-emerald-500' : 'border-red-500'}`}>
          <div className="flex justify-between items-start mb-2">
            <div className="text-[hsl(var(--muted))] font-medium text-sm">صافي الربح (الفعلي)</div>
            <div className={`p-2 rounded-lg ${actualProfit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <Wallet size={18} />
            </div>
          </div>
          <div className={`text-2xl font-black ${actualProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {actualProfit.toLocaleString('ar-AE')} <span className="text-sm font-normal opacity-70">د.إ</span>
          </div>
          <div className="text-xs text-[hsl(var(--muted))] mt-2 flex items-center gap-1">
            {actualProfit >= 0 ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-red-500" />}
            الإيرادات المحصلة ناقص المصروفات
          </div>
        </div>

        {/* Expected Profit */}
        <div className={`glass-card p-5 border-b-4 border-emerald-500`}>
          <div className="flex justify-between items-start mb-2">
            <div className="text-[hsl(var(--muted))] font-medium text-sm">الربح المتوقع</div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Activity size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {expectedProfit.toLocaleString('ar-AE')} <span className="text-sm font-normal opacity-70">د.إ</span>
          </div>
          <div className="text-xs text-[hsl(var(--muted))] mt-2 flex items-center gap-1">
            إجمالي الفواتير ناقص المصروفات
          </div>
        </div>

        {/* Total Revenues */}
        <div className="glass-card p-5 border-b-4 border-green-500">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[hsl(var(--muted))] font-medium text-sm">الإيرادات (المحصلة)</div>
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-green-600">
            {collectedRevenue.toLocaleString('ar-AE')} <span className="text-sm font-normal opacity-70">د.إ</span>
          </div>
          <div className="text-xs text-[hsl(var(--muted))] mt-2">
            من أصل <span className="font-bold">{totalRevenue.toLocaleString('ar-AE')}</span> فواتير مصدرة
          </div>
        </div>

        {/* Total Expenses */}
        <div className="glass-card p-5 border-b-4 border-rose-500">
          <div className="flex justify-between items-start mb-2">
            <div className="text-[hsl(var(--muted))] font-medium text-sm">إجمالي المصروفات</div>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ArrowDownRight size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">
            {totalExpenses.toLocaleString('ar-AE')} <span className="text-sm font-normal opacity-70">د.إ</span>
          </div>
          <div className="text-xs text-[hsl(var(--muted))] mt-2">
            جميع المصروفات المسجلة
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Income vs Expenses Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart size={18} className="text-emerald-500" /> الإيرادات مقابل المصروفات (شهرياً)
          </h3>
          <div className="h-80" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted))' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Bar dataKey="revenues" name="الإيرادات" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="المصروفات" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Trend Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-500" /> نمو صافي الأرباح
          </h3>
          <div className="h-80" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted))' }} />
                <YAxis tick={{ fill: 'hsl(var(--muted))' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Line type="monotone" dataKey="profit" name="صافي الربح" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Project Profitability Table */}
      <div className="glass-card mt-8 overflow-hidden">
        <div className="p-6 border-b border-[hsl(var(--border))] flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Briefcase size={18} className="text-emerald-500" /> ربحية المشاريع (تقييم الأداء)
            </h3>
            <p className="text-sm text-[hsl(var(--muted))] mt-1">تحليل مفصل للإيرادات والمصروفات لكل مشروع على حدة لتقييم مدى نجاحه.</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-xl">
            <PieChart size={24} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="text-right">المشروع</th>
                <th className="text-right">العميل</th>
                <th className="text-center">الإيرادات المحصلة</th>
                <th className="text-center">المصروفات</th>
                <th className="text-center">صافي الربح</th>
                <th className="text-center">التقييم</th>
              </tr>
            </thead>
            <tbody>
              {projectStats.length > 0 ? projectStats.map((p: any) => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/projects/${p.id}`} className="font-bold text-[hsl(var(--foreground))] hover:text-emerald-600 transition-colors">
                      {p.name}
                    </Link>
                  </td>
                  <td className="text-[hsl(var(--muted))] font-medium">
                    {p.client?.company_name || p.client?.name || '—'}
                  </td>
                  <td className="text-center text-emerald-600 font-bold">
                    {p.revenues.toLocaleString('ar-AE')} د.إ
                  </td>
                  <td className="text-center text-rose-600 font-bold">
                    {p.costs.toLocaleString('ar-AE')} د.إ
                  </td>
                  <td className="text-center">
                    <span className={`font-black ${p.profit > 0 ? 'text-emerald-600' : p.profit < 0 ? 'text-rose-600' : 'text-gray-500'}`}>
                      <span dir="ltr">{p.profit > 0 ? '+' : ''}{p.profit.toLocaleString('ar-AE')}</span> د.إ
                    </span>
                    {p.revenues > 0 && (
                      <div className="text-xs text-[hsl(var(--muted))] mt-1">
                        هامش: <span dir="ltr">{p.margin.toFixed(1)}%</span>
                      </div>
                    )}
                  </td>
                  <td className="text-center">
                    {p.profit > 0 ? (
                      <span className="badge-success px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400">مشروع رابح 🟢</span>
                    ) : p.profit < 0 ? (
                      <span className="badge-danger px-3 py-1 bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-400">مشروع خاسر 🔴</span>
                    ) : (
                      <span className="badge-gray px-3 py-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">نقطة تعادل ⚪</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[hsl(var(--muted))]">
                    لا توجد بيانات مشاريع لعرضها
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

