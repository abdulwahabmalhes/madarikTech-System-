import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { X } from 'lucide-react'
import api from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import { Package, Plus, Search, Tag, DollarSign } from 'lucide-react'

const CATEGORY_MAP: Record<string, { label: string; badge: string }> = {
  saas:        { label: 'SaaS',        badge: 'badge-purple' },
  service:     { label: 'خدمة',        badge: 'badge-info' },
  maintenance: { label: 'صيانة',       badge: 'badge-warning' },
  product:     { label: 'منتج',        badge: 'badge-gray' },
}

const PRICING_MAP: Record<string, string> = {
  monthly: 'شهري', fixed: 'ثابت', hourly: 'بالساعة', custom: 'حسب الطلب', yearly: 'سنوي'
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [form, setForm] = useState({ name: '', name_ar: '', category: 'service', pricing_model: 'fixed', base_price: '', features: [] as string[] })
  const [newFeature, setNewFeature] = useState('')
  const [catForm, setCatForm] = useState({ name_ar: '', name: '', badge_color: 'badge-gray' })
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setShowAdd(false)
      setForm({ name: '', name_ar: '', category: 'service', pricing_model: 'fixed', base_price: '', features: [] })
      setNewFeature('')
    }
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => api.get('/product-categories').then(r => r.data)
  })

  const addCategoryMutation = useMutation({
    mutationFn: (data: typeof catForm) => api.post('/product-categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-categories'] })
      setShowAddCategory(false)
      setCatForm({ name_ar: '', name: '', badge_color: 'badge-gray' })
    }
  })

  const dynamicCategories = categoriesData?.data ?? []

  const { data, isLoading } = useQuery({
    queryKey: ['products', search, category],
    queryFn: () =>
      api.get('/products', {
        params: { per_page: 50, search: search || undefined, category: category || undefined }
      }).then(r => r.data),
  })

  const products = data?.data ?? []

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">المنتجات والخدمات</h2>
          <p className="text-sm text-[hsl(var(--muted))]">{products.length} منتج/خدمة</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> إضافة منتج</button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[hsl(var(--muted))]" />
          <input
            type="text" placeholder="البحث..." value={search}
            onChange={e => setSearch(e.target.value)} className="form-input ps-9 h-9 py-2"
          />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="form-input h-9 py-2 w-36">
          <option value="">كل الفئات</option>
          {Object.entries(CATEGORY_MAP).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
          {dynamicCategories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card h-48 animate-pulse bg-[hsl(var(--border))]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product: any) => {
            const dynamicCat = dynamicCategories.find((c: any) => c.id == product.category)
            const cat = dynamicCat 
              ? { label: dynamicCat.name_ar, badge: dynamicCat.badge_color } 
              : (CATEGORY_MAP[product.category] ?? { label: product.category, badge: 'badge-gray' })
            const features = (() => {
              try {
                const f = typeof product.features === 'string' ? JSON.parse(product.features) : product.features
                return Array.isArray(f) ? f : []
              } catch { return [] }
            })()

            return (
              <div key={product.id} className="glass-card p-5 hover:shadow-md transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Package size={20} className="text-white" />
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.badge}`}>
                    {cat.label}
                  </span>
                </div>

                {/* Name */}
                <div className="mb-2">
                  <h3 className="font-semibold text-[hsl(var(--foreground))] mb-0.5">{product.name_ar || product.name}</h3>
                  {product.name_ar && product.name !== product.name_ar && (
                    <div className="text-xs text-[hsl(var(--muted))]">{product.name}</div>
                  )}
                </div>

                {/* Description */}
                {product.short_description && (
                  <p className="text-xs text-[hsl(var(--muted))] mb-3 line-clamp-2">{product.short_description}</p>
                )}

                {/* Features */}
                {features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {features.slice(0, 3).map((f: string, i: number) => (
                      <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md font-medium border border-slate-200 dark:border-slate-700">
                        {f}
                      </span>
                    ))}
                    {features.length > 3 && (
                      <span className="text-xs text-slate-500 px-1 py-1 flex items-center font-medium">+{features.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Pricing */}
                <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
                  <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted))]">
                    <Tag size={12} />
                    {PRICING_MAP[product.pricing_model] ?? product.pricing_model}
                  </div>
                  {product.base_price ? (
                    <div className="flex items-center gap-1 font-bold text-emerald-600">
                      <span>{Number(product.base_price).toLocaleString('ar-AE')}</span>
                      <span className="text-xs font-normal text-[hsl(var(--muted))]">
                        د.إ{product.pricing_model === 'monthly' ? '/شهر' : product.pricing_model === 'hourly' ? '/ساعة' : ''}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-[hsl(var(--muted))]">حسب الطلب</span>
                  )}
                </div>

                {/* Active Badge */}
                {!product.is_active && (
                  <div className="mt-2 text-center">
                    <span className="text-xs badge-gray">غير نشط</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Package size={40} className="mx-auto text-[hsl(var(--muted))] mb-3" />
          <p className="text-[hsl(var(--muted))]">لا توجد منتجات مطابقة</p>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="إضافة منتج أو خدمة">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">الاسم بالعربية</label>
            <input value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} className="form-input" placeholder="اسم المنتج/الخدمة بالعربية" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">الاسم بالإنجليزية</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" placeholder="اسم المنتج/الخدمة بالإنجليزية (اختياري)" dir="ltr" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex gap-2 items-end mb-1.5">
                <label className="block text-xs font-medium text-[hsl(var(--muted))] flex-1">الفئة</label>
                <button type="button" onClick={() => setShowAddCategory(true)} className="text-xs text-emerald-600 hover:underline">
                  + إضافة فئة
                </button>
              </div>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="form-input">
                <optgroup label="الفئات الأساسية">
                  {Object.entries(CATEGORY_MAP).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </optgroup>
                {dynamicCategories.length > 0 && (
                  <optgroup label="فئات مخصصة">
                    {dynamicCategories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">نموذج التسعير</label>
              <select value={form.pricing_model} onChange={e => setForm({...form, pricing_model: e.target.value})} className="form-input">
                {Object.entries(PRICING_MAP).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">السعر الأساسي</label>
            <input type="number" value={form.base_price} onChange={e => setForm({...form, base_price: e.target.value})} className="form-input" placeholder="0.00" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">الخصائص والميزات (اكتب واضغط Enter)</label>
            <input 
              type="text" 
              value={newFeature} 
              onChange={e => setNewFeature(e.target.value)} 
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (newFeature.trim()) {
                    setForm({ ...form, features: [...form.features, newFeature.trim()] })
                    setNewFeature('')
                  }
                }
              }}
              className="form-input mb-2" 
              placeholder="أضف خاصية..." 
            />
            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.features.map((f, i) => (
                  <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md font-medium border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                    {f}
                    <button type="button" onClick={() => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) })} className="text-slate-400 hover:text-red-500">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button className="btn-secondary" onClick={() => setShowAdd(false)}>إلغاء</button>
            <button 
              className="btn-primary" 
              onClick={() => addMutation.mutate(form)}
              disabled={(!form.name_ar && !form.name) || addMutation.isPending}
            >
              {addMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Category Modal */}
      <Modal isOpen={showAddCategory} onClose={() => setShowAddCategory(false)} title="إضافة فئة جديدة">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">اسم الفئة بالعربية</label>
            <input value={catForm.name_ar} onChange={e => setCatForm({...catForm, name_ar: e.target.value})} className="form-input" placeholder="مثال: استضافة" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">اسم الفئة بالإنجليزية (اختياري)</label>
            <input value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="form-input" placeholder="مثال: Hosting" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">لون التمييز (الشارة)</label>
            <select value={catForm.badge_color} onChange={e => setCatForm({...catForm, badge_color: e.target.value})} className="form-input">
              <option value="badge-gray">رمادي (افتراضي)</option>
              <option value="badge-info">أزرق</option>
              <option value="badge-success">أخضر</option>
              <option value="badge-warning">أصفر/برتقالي</option>
              <option value="badge-danger">أحمر</option>
              <option value="badge-purple">بنفسجي</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button className="btn-secondary" onClick={() => setShowAddCategory(false)}>إلغاء</button>
            <button 
              className="btn-primary" 
              onClick={() => addCategoryMutation.mutate(catForm)}
              disabled={!catForm.name_ar || addCategoryMutation.isPending}
            >
              {addCategoryMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
