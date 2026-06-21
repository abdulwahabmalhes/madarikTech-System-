import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import {
  TrendingUp, TrendingDown, DollarSign, AlertTriangle,
  FolderKanban, Users, CheckSquare, Clock, Calendar
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']

function KpiCard({ title, value, subtitle, icon: Icon, trend, color }: any) {
  const isPositive = trend >= 0
  return (
    <div className="kpi-card slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-[hsl(var(--foreground))] mb-0.5">{value}</div>
      <div className="text-sm text-[hsl(var(--muted))]">{title}</div>
      {subtitle && <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{subtitle}</div>}
    </div>
  )
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}م`
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}ك`
  return amount.toLocaleString('ar-AE')
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then(r => r.data),
  })

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  const getHealthBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Islamic Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[hsl(var(--muted))]">بسم الله الرحمن الرحيم</p>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))] mt-1">
            أهلاً، {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-[hsl(var(--muted))]">
            {new Date().toLocaleDateString('ar-AE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="text-end">
          <div className="text-xs text-[hsl(var(--muted))]">آخر تحديث</div>
          <div className="text-sm font-medium text-[hsl(var(--foreground))]">
            {new Date().toLocaleTimeString('ar-AE', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="kpi-card h-32 animate-pulse bg-[hsl(var(--border))]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            title="الإيرادات هذا الشهر"
            value={`${formatCurrency(data?.kpis?.revenue_mtd ?? 0)} د.إ`}
            icon={DollarSign}
            color="bg-emerald-600"
            trend={12}
            subtitle={`سنوياً: ${formatCurrency(data?.kpis?.revenue_ytd ?? 0)} د.إ`}
          />
          <KpiCard
            title="مستحقات غير مدفوعة"
            value={`${formatCurrency(data?.kpis?.outstanding ?? 0)} د.إ`}
            icon={Clock}
            color="bg-amber-500"
            subtitle={`متأخرة: ${formatCurrency(data?.kpis?.overdue_amount ?? 0)} د.إ`}
          />
          <KpiCard
            title="المشاريع النشطة"
            value={data?.kpis?.active_projects ?? 0}
            icon={FolderKanban}
            color="bg-green-600"
            subtitle={`${data?.kpis?.projects_at_risk ?? 0} مشاريع في خطر`}
          />
          <KpiCard
            title="العملاء المحتملين"
            value={data?.kpis?.leads_in_pipeline ?? 0}
            icon={Users}
            color="bg-emerald-600"
            subtitle={`${data?.kpis?.new_leads_mtd ?? 0} جديد هذا الشهر`}
          />
          <KpiCard
            title="قيمة خط المبيعات"
            value={`${formatCurrency(data?.kpis?.pipeline_value ?? 0)} د.إ`}
            icon={TrendingUp}
            color="bg-purple-600"
          />
          <KpiCard
            title="مهام مستحقة اليوم"
            value={data?.kpis?.tasks_due_today ?? 0}
            icon={CheckSquare}
            color="bg-cyan-600"
            subtitle={`${data?.kpis?.overdue_tasks ?? 0} متأخرة`}
          />
          <KpiCard
            title="المصروفات هذا الشهر"
            value={`${formatCurrency(data?.kpis?.expenses_mtd ?? 0)} د.إ`}
            icon={TrendingDown}
            color="bg-rose-600"
          />
          <KpiCard
            title="صافي الربح (الشهر)"
            value={`${formatCurrency(data?.kpis?.net_profit_mtd ?? 0)} د.إ`}
            icon={DollarSign}
            color="bg-teal-600"
            trend={8}
          />
        </div>
      )}

      {/* Approaching Deadlines - Calendar Style */}
      {data?.approaching_deadlines?.length > 0 && (
        <div className="glass-card p-5 border-t-4 border-amber-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[hsl(var(--foreground))] flex items-center gap-2">
              <Calendar size={18} className="text-amber-500" /> الجدول الزمني (مشاريع يقترب تسليمها)
            </h3>
            <a href="/projects" className="text-xs text-amber-600 hover:underline">عرض الكل</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.approaching_deadlines.map((project: any) => {
              const d = new Date(project.expected_end_date)
              const daysLeft = Math.ceil((d.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
              const isUrgent = daysLeft <= 7
              const monthName = d.toLocaleDateString('ar-AE', { month: 'short' })
              const dayNum = d.getDate()
              
              return (
                <a
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md ${isUrgent ? 'bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-[hsl(var(--surface))] border-[hsl(var(--border))]'}`}
                >
                  <div className={`flex-shrink-0 w-14 h-16 rounded-lg flex flex-col items-center justify-center overflow-hidden border ${isUrgent ? 'bg-white border-red-200 dark:bg-gray-800 dark:border-red-800' : 'bg-white border-amber-200 dark:bg-gray-800 dark:border-amber-800'}`}>
                    <div className={`w-full text-center text-[10px] font-bold py-0.5 text-white ${isUrgent ? 'bg-red-500' : 'bg-amber-500'}`}>
                      {monthName}
                    </div>
                    <div className={`text-xl font-black mt-0.5 ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                      {dayNum}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[hsl(var(--foreground))] truncate mb-0.5">{project.name}</div>
                    <div className="text-xs text-[hsl(var(--muted))] truncate mb-1">{project.client?.name ?? project.client?.company_name}</div>
                    <div className={`text-[10px] font-medium ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                      ⏳ {daysLeft > 0 ? `متبقي ${daysLeft} يوم` : 'موعد التسليم اليوم!'}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="font-semibold text-[hsl(var(--foreground))] mb-4">الإيرادات والمصروفات (6 أشهر)</h3>
          {isLoading ? (
            <div className="h-56 bg-[hsl(var(--border))] animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data?.monthly_chart ?? []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip
                  formatter={(value: number) => [`${formatCurrency(value)} د.إ`]}
                  labelFormatter={(label) => `شهر: ${label}`}
                />
                <Area type="monotone" dataKey="revenue" name="الإيرادات" stroke="#3B82F6" fill="url(#colorRevenue)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" name="المصروفات" stroke="#EF4444" fill="url(#colorExpenses)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Lead Sources Pie */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-[hsl(var(--foreground))] mb-4">مصادر العملاء المحتملين</h3>
          {isLoading ? (
            <div className="h-56 bg-[hsl(var(--border))] animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data?.lead_sources ?? []}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {(data?.lead_sources ?? []).map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'عميل محتمل']} />
                <Legend
                  formatter={(value) => <span className="text-xs">{value}</span>}
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Active Projects + Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[hsl(var(--foreground))]">المشاريع النشطة</h3>
            <a href="/projects" className="text-xs text-emerald-600 hover:underline">عرض الكل</a>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-[hsl(var(--border))] animate-pulse rounded-lg" />
              ))
            ) : (
              (data?.active_projects ?? []).map((project: any) => (
                <a
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors cursor-pointer"
                >
                  <div className={`w-2 h-12 rounded-full flex-shrink-0 ${getHealthBg(project.health_score)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[hsl(var(--foreground))] truncate">{project.name}</div>
                    <div className="text-xs text-[hsl(var(--muted))]">{project.client?.name ?? project.client?.company_name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-[hsl(var(--border))] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${project.progress_percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-[hsl(var(--muted))]">{project.progress_percent}%</span>
                    </div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <span className={`text-lg font-bold ${getHealthColor(project.health_score)}`}>
                      {project.health_score}
                    </span>
                    <div className="text-xs text-[hsl(var(--muted))]">صحة</div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[hsl(var(--foreground))]">أحدث العملاء المحتملين</h3>
            <a href="/crm" className="text-xs text-emerald-600 hover:underline">عرض الكل</a>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-[hsl(var(--border))] animate-pulse rounded-lg" />
              ))
            ) : (
              (data?.recent_leads ?? []).map((lead: any) => (
                <a
                  key={lead.id}
                  href={`/crm/leads/${lead.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(var(--surface-hover))] transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[hsl(var(--foreground))] truncate">{lead.name}</div>
                    <div className="text-xs text-[hsl(var(--muted))]">{lead.source}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <StageTag stage={lead.stage} />
                    {lead.estimated_value && (
                      <div className="text-xs text-[hsl(var(--muted))] text-end mt-0.5">
                        {formatCurrency(lead.estimated_value)} د.إ
                      </div>
                    )}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StageTag({ stage }: { stage: string }) {
  const stageMap: Record<string, { label: string; class: string }> = {
    'new':              { label: 'جديد', class: 'badge-info' },
    'contacted':        { label: 'تم التواصل', class: 'badge-purple' },
    'follow-up':        { label: 'متابعة', class: 'badge-warning' },
    'meeting-scheduled': { label: 'اجتماع مجدول', class: 'badge-info' },
    'proposal-sent':    { label: 'عرض مُرسل', class: 'badge-purple' },
    'negotiation':      { label: 'تفاوض', class: 'badge-warning' },
    'won':              { label: 'تم الفوز', class: 'badge-success' },
    'lost':             { label: 'خسارة', class: 'badge-danger' },
  }
  const { label, class: cls } = stageMap[stage] ?? { label: stage, class: 'badge-gray' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  )
}
