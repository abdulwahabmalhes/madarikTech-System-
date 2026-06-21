import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Plus, Search, Calendar, RefreshCw, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import RenewalFormModal from '../components/RenewalFormModal'

export default function RenewalsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [renewalToEdit, setRenewalToEdit] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all') // all, active, expired, upcoming

  const { data: renewalsData, isLoading } = useQuery({
    queryKey: ['renewals'],
    queryFn: () => api.get('/renewals').then(r => r.data)
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/renewals/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['renewals'] })
  })

  const renewals = Array.isArray(renewalsData) ? renewalsData : (renewalsData?.data && Array.isArray(renewalsData.data) ? renewalsData.data : [])

  // Derived stats
  const activeRenewals = (renewals || []).filter((r: any) => r?.status === 'active')
  const expiredRenewals = (renewals || []).filter((r: any) => r?.status === 'expired')
  const upcomingCount = (renewals || []).filter((r: any) => {
    if (!r?.expiry_date) return false
    const daysLeft = Math.ceil((new Date(r.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    return daysLeft > 0 && daysLeft <= 30 && r.status === 'active'
  }).length
  
  const expectedRevenue = activeRenewals.reduce((sum: number, r: any) => sum + Number(r?.price || 0), 0)

  // Filtered list
  const filteredRenewals = (renewals || []).filter((r: any) => {
    const matchesSearch = (r?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (r?.client?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false

    if (filterType === 'active') return r.status === 'active'
    if (filterType === 'expired') return r.status === 'expired'
    if (filterType === 'upcoming') {
      if (!r?.expiry_date) return false
      const daysLeft = Math.ceil((new Date(r.expiry_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
      return daysLeft > 0 && daysLeft <= 30 && r.status === 'active'
    }
    return true
  })

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'domain': return 'دومين'
      case 'hosting': return 'استضافة'
      case 'maintenance': return 'عقد صيانة'
      case 'subscription': return 'اشتراك'
      default: return 'أخرى'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold dark:bg-emerald-900/30 dark:text-emerald-400">نشط</span>
      case 'expired': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold dark:bg-red-900/30 dark:text-red-400">منتهي</span>
      case 'renewed': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold dark:bg-blue-900/30 dark:text-blue-400">تم التجديد</span>
      case 'cancelled': return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-bold dark:bg-gray-800 dark:text-gray-400">ملغي</span>
      default: return null
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
            <RefreshCw className="text-emerald-500" /> إدارة التجديدات
          </h2>
          <p className="text-[hsl(var(--muted))] mt-1">
            تابع تجديدات عملائك، الدومينات، الاستضافات، وعقود الصيانة السنوية.
          </p>
        </div>
        <button 
          onClick={() => { setRenewalToEdit(null); setIsModalOpen(true) }}
          className="btn-primary"
        >
          <Plus size={18} /> إضافة تجديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-t-4 border-emerald-500">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <CheckCircle2 size={20} />
            <h3 className="font-semibold text-sm">تجديدات نشطة</h3>
          </div>
          <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{activeRenewals.length}</p>
        </div>
        
        <div className="glass-card p-5 border-t-4 border-amber-500">
          <div className="flex items-center gap-3 text-amber-600 mb-2">
            <Calendar size={20} />
            <h3 className="font-semibold text-sm">تستحق التجديد قريباً (30 يوم)</h3>
          </div>
          <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{upcomingCount}</p>
        </div>

        <div className="glass-card p-5 border-t-4 border-red-500">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <XCircle size={20} />
            <h3 className="font-semibold text-sm">تجديدات منتهية</h3>
          </div>
          <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{expiredRenewals.length}</p>
        </div>

        <div className="glass-card p-5 border-t-4 border-blue-500">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <RefreshCw size={20} />
            <h3 className="font-semibold text-sm">إيرادات متوقعة للتجديد</h3>
          </div>
          <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{expectedRevenue.toLocaleString()} د.إ</p>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted))] w-5 h-5" />
            <input 
              type="text" 
              placeholder="ابحث عن اسم الخدمة أو العميل..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input ps-10"
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="form-input w-40"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">جميع التجديدات</option>
              <option value="active">النشطة فقط</option>
              <option value="upcoming">تستحق قريباً</option>
              <option value="expired">المنتهية فقط</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10">جاري التحميل...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-start">
              <thead className="bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
                <tr>
                  <th className="p-4 font-semibold text-start">اسم الخدمة</th>
                  <th className="p-4 font-semibold text-start">النوع</th>
                  <th className="p-4 font-semibold text-start">العميل</th>
                  <th className="p-4 font-semibold text-start">تاريخ الانتهاء</th>
                  <th className="p-4 font-semibold text-start">المتبقي</th>
                  <th className="p-4 font-semibold text-start">سعر التجديد</th>
                  <th className="p-4 font-semibold text-start">الحالة</th>
                  <th className="p-4 font-semibold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border))]">
                {filteredRenewals.length > 0 ? (
                  filteredRenewals.map((r: any) => {
                    const expiryDate = new Date(r.expiry_date)
                    const today = new Date()
                    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
                    
                    let daysColor = "text-[hsl(var(--foreground))]"
                    if (daysLeft < 0) daysColor = "text-red-600 font-bold"
                    else if (daysLeft <= 30) daysColor = "text-amber-500 font-bold"

                    return (
                      <tr key={r.id} className="hover:bg-[hsl(var(--surface-hover))] transition-colors">
                        <td className="p-4 font-medium text-[hsl(var(--foreground))]">
                          {r.name}
                          {r.auto_renew && <span className="block text-[10px] text-emerald-600 mt-1">تجديد تلقائي</span>}
                        </td>
                        <td className="p-4 text-[hsl(var(--muted))]">{getTypeLabel(r.type)}</td>
                        <td className="p-4 text-[hsl(var(--muted))]">{r.client?.name || '-'}</td>
                        <td className="p-4 text-[hsl(var(--muted))]" dir="ltr">{r.expiry_date}</td>
                        <td className={`p-4 ${daysColor}`}>
                          {daysLeft < 0 ? `انتهى منذ ${Math.abs(daysLeft)} يوم` : `${daysLeft} يوم`}
                        </td>
                        <td className="p-4 font-medium text-[hsl(var(--foreground))]">{r.price} د.إ</td>
                        <td className="p-4">{getStatusBadge(r.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => { setRenewalToEdit(r); setIsModalOpen(true) }}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-lg transition-colors dark:hover:bg-emerald-900/20"
                            >
                              تعديل
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm('هل أنت متأكد من الحذف؟')) {
                                  deleteMutation.mutate(r.id)
                                }
                              }}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors dark:hover:bg-red-900/20"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[hsl(var(--muted))]">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      لا توجد تجديدات مسجلة تطابق بحثك.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <RenewalFormModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setRenewalToEdit(null); }} 
          renewalToEdit={renewalToEdit} 
        />
      )}
    </div>
  )
}
