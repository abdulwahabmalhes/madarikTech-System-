import { useState } from 'react'
import { HardDrive, Plus, Monitor, Server, Smartphone, Edit2, Trash2, Calendar, Shield } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import AssetFormModal from '../components/AssetFormModal'

const TYPE_MAP: Record<string, { label: string; icon: any; color: string }> = {
  'laptop': { label: 'جهاز محمول', icon: Monitor, color: 'text-green-600 bg-green-50 border-green-500' },
  'mobile': { label: 'هاتف ذكي', icon: Smartphone, color: 'text-emerald-600 bg-emerald-50 border-emerald-500' },
  'monitor': { label: 'شاشة', icon: Monitor, color: 'text-emerald-600 bg-emerald-50 border-emerald-500' },
  'other': { label: 'أخرى', icon: Server, color: 'text-amber-600 bg-amber-50 border-amber-500' },
}

export default function AssetsPage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [assetToEdit, setAssetToEdit] = useState<any>(null)

  const { data: assets, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => api.get('/assets').then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/assets/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assets'] })
  })

  const handleEdit = (asset: any) => {
    setAssetToEdit(asset)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setAssetToEdit(null)
    setIsModalOpen(true)
  }

  const getCount = (type: string) => assets?.filter((a: any) => a.type === type)?.length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">الأصول والمعدات</h2>
          <p className="text-[hsl(var(--muted))] mt-1">إدارة أصول الشركة وتتبع العهد والمعدات المسلمة للموظفين</p>
        </div>
        <button onClick={handleAdd} className="btn-primary"><Plus size={16} /> إضافة أصل جديد</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 border-t-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-[hsl(var(--muted))]">الأجهزة المحمولة</h4>
            <div className="p-1.5 bg-green-50 text-green-600 rounded-lg"><Monitor size={14} /></div>
          </div>
          <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{getCount('laptop')}</div>
        </div>
        <div className="glass-card p-5 border-t-4 border-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-[hsl(var(--muted))]">الهواتف والأجهزة الذكية</h4>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Smartphone size={14} /></div>
          </div>
          <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{getCount('mobile')}</div>
        </div>
        <div className="glass-card p-5 border-t-4 border-amber-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-[hsl(var(--muted))]">المعدات الأخرى</h4>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Server size={14} /></div>
          </div>
          <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{getCount('other')}</div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="glass-card h-32 animate-pulse" />)}
        </div>
      ) : assets?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset: any) => {
            const config = TYPE_MAP[asset.type] || TYPE_MAP['other']
            const Icon = config.icon

            return (
              <div key={asset.id} className="glass-card p-5 relative group">
                <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(asset)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100">
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من حذف هذا الأصل؟')) deleteMutation.mutate(asset.id)
                    }} 
                    className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${config.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[hsl(var(--foreground))]">{asset.name}</h3>
                    <div className="text-xs text-[hsl(var(--muted))] flex items-center gap-1 mt-1">
                      <Shield size={12} /> {config.label}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
                  <span className="text-xs text-[hsl(var(--muted))] flex items-center gap-1">
                    <Calendar size={12} /> {asset.purchase_date || 'غير محدد'}
                  </span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[hsl(var(--surface))]">
                    {asset.provider || 'غير محدد المورد'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <HardDrive size={48} className="mx-auto text-[hsl(var(--muted))] mb-4 opacity-20" />
          <h3 className="text-lg font-bold text-[hsl(var(--foreground))] mb-2">لا توجد أصول مسجلة بعد</h3>
          <p className="text-[hsl(var(--muted))] max-w-md mx-auto">قم بتسجيل أجهزة ومعدات الشركة وربطها بالموظفين لمتابعة العهد.</p>
          <button onClick={handleAdd} className="btn-primary mx-auto mt-6 px-6 py-2">تسجيل أصل جديد</button>
        </div>
      )}

      <AssetFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        assetToEdit={assetToEdit}
      />
    </div>
  )
}

