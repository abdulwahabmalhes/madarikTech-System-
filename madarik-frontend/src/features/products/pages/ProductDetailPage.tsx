import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, Package, Video, FileText, Truck, Lightbulb, Users, Receipt, DollarSign, Activity, Trash2, Save, Edit2 } from 'lucide-react'
import api from '@/lib/api'
import { Modal } from '@/components/ui/Modal'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then(r => r.data)
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.put(`/products/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['product', id] })
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate('/products')
    }
  })

  if (isLoading) return <div className="p-8 text-center animate-pulse">جاري التحميل...</div>
  if (!product) return <div className="p-8 text-center text-red-500">لم يتم العثور على المنتج</div>

  const handleUpdateField = (field: string, value: string) => {
    updateMutation.mutate({ [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/products')} className="p-2 hover:bg-[hsl(var(--surface))] rounded-lg transition-colors">
            <ArrowRight size={20} />
          </button>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Package size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{product.name_ar || product.name}</h2>
            <p className="text-[hsl(var(--muted))]">{product.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
                deleteMutation.mutate()
              }
            }} 
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف المنتج"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3 mb-2 text-[hsl(var(--muted))]">
            <Activity size={18} />
            <span className="font-medium">عدد المرات المباعة</span>
          </div>
          <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{product.sales_count || 0}</div>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3 mb-2 text-[hsl(var(--muted))]">
            <DollarSign size={18} />
            <span className="font-medium">إجمالي الإيرادات</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {Number(product.total_sales || 0).toLocaleString()} <span className="text-sm font-normal text-[hsl(var(--muted))]">د.إ</span>
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-2 text-[hsl(var(--muted))]">
            <Users size={18} />
            <span className="font-medium">العملاء (عبر الفواتير)</span>
          </div>
          <div className="text-2xl font-bold text-[hsl(var(--foreground))]">
            {/* Unique clients count */}
            {Array.from(new Set((product.invoices || []).map((i: any) => i.client_id))).length}
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3 mb-2 text-[hsl(var(--muted))]">
            <Receipt size={18} />
            <span className="font-medium">الفواتير المرتبطة</span>
          </div>
          <div className="text-2xl font-bold text-[hsl(var(--foreground))]">
            {(product.invoices || []).length}
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="glass-card overflow-hidden">
        <div className="flex overflow-x-auto border-b border-[hsl(var(--border))]">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: Package },
            { id: 'ideas', label: 'أفكار التطوير', icon: Lightbulb },
            { id: 'documentation', label: 'الدوكيومنتشن', icon: FileText },
            { id: 'video', label: 'فيديو الشرح', icon: Video },
            { id: 'delivery', label: 'طريقة التسليم', icon: Truck },
            { id: 'invoices', label: 'الفواتير والعملاء', icon: Receipt },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id ? 'text-emerald-600' : 'text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'
                }`}
              >
                <Icon size={16} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full" />
                )}
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">الوصف</h3>
                <p className="text-[hsl(var(--muted))] whitespace-pre-wrap">{product.short_description || 'لا يوجد وصف مضاف.'}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">السعر ونموذج التسعير</h3>
                <p className="text-[hsl(var(--muted))]">{product.pricing_model} - {product.base_price ? `${Number(product.base_price).toLocaleString()} د.إ` : 'حسب الطلب'}</p>
              </div>
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-2">الميزات</h3>
                  <ul className="list-disc list-inside text-[hsl(var(--muted))]">
                    {(typeof product.features === 'string' ? JSON.parse(product.features) : product.features).map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Ideas */}
          {activeTab === 'ideas' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">أفكار لتطوير المنتج</h3>
              <p className="text-sm text-[hsl(var(--muted))] mb-4">اكتب أفكارك ومقترحاتك لتطوير هذا المنتج مستقبلاً هنا.</p>
              
              <textarea
                id="ideas_input"
                className="form-input w-full min-h-[200px]"
                defaultValue={product.ideas || ''}
                placeholder="أضف أفكارك هنا..."
              />
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const val = (document.getElementById('ideas_input') as HTMLTextAreaElement).value;
                    handleUpdateField('ideas', val);
                  }}
                  className="btn-primary px-6 flex items-center gap-2"
                >
                  <Save size={16} /> حفظ الأفكار
                </button>
                {product.ideas && (
                  <button 
                    onClick={() => {
                      if(confirm('هل أنت متأكد من حذف الأفكار؟')) {
                        (document.getElementById('ideas_input') as HTMLTextAreaElement).value = '';
                        handleUpdateField('ideas', '');
                      }
                    }}
                    className="btn-secondary text-red-500 hover:text-red-600 flex items-center gap-2"
                  >
                    <Trash2 size={16} /> مسح الكل
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Documentation */}
          {activeTab === 'documentation' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">الدوكيومنتشن (التوثيق) وملفات المنتج</h3>
              <p className="text-sm text-[hsl(var(--muted))] mb-4">أضف رابط التوثيق الخاص بالمنتج (مثال: رابط Google Drive، Notion، أو رابط الموقع).</p>
              
              <div className="flex gap-2">
                <input
                  type="url"
                  id="doc_input"
                  className="form-input flex-1"
                  defaultValue={product.documentation_url || ''}
                  placeholder="https://..."
                  dir="ltr"
                />
                <button 
                  onClick={() => {
                    const val = (document.getElementById('doc_input') as HTMLInputElement).value;
                    handleUpdateField('documentation_url', val);
                  }}
                  className="btn-primary px-6 flex items-center gap-2"
                >
                  <Save size={16} /> حفظ
                </button>
                {product.documentation_url && (
                  <button 
                    onClick={() => {
                      if(confirm('هل أنت متأكد من حذف الرابط؟')) {
                        (document.getElementById('doc_input') as HTMLInputElement).value = '';
                        handleUpdateField('documentation_url', '');
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-red-100 transition-colors"
                    title="حذف الرابط"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              
              {product.documentation_url && (
                <div className="mt-4 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText size={20} className="flex-shrink-0" />
                    <span className="truncate max-w-md" dir="ltr">{product.documentation_url}</span>
                  </div>
                  <a href={product.documentation_url} target="_blank" rel="noreferrer" className="btn-primary bg-emerald-600 hover:bg-emerald-700 py-1.5 px-4 rounded-lg text-sm flex-shrink-0">فتح الرابط</a>
                </div>
              )}
            </div>
          )}

          {/* Video */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">فيديو الشرح</h3>
              <p className="text-sm text-[hsl(var(--muted))] mb-4">أضف رابط فيديو يشرح المنتج للعميل أو لفريق العمل (مثال: يوتيوب، فيميو).</p>
              
              <div className="flex gap-2">
                <input
                  type="url"
                  id="video_input"
                  className="form-input flex-1"
                  defaultValue={product.video_url || ''}
                  placeholder="https://youtube.com/..."
                  dir="ltr"
                />
                <button 
                  onClick={() => {
                    const val = (document.getElementById('video_input') as HTMLInputElement).value;
                    handleUpdateField('video_url', val);
                  }}
                  className="btn-primary px-6 flex items-center gap-2"
                >
                  <Save size={16} /> حفظ
                </button>
                {product.video_url && (
                  <button 
                    onClick={() => {
                      if(confirm('هل أنت متأكد من حذف الرابط؟')) {
                        (document.getElementById('video_input') as HTMLInputElement).value = '';
                        handleUpdateField('video_url', '');
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl border border-red-100 transition-colors"
                    title="حذف الرابط"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              {product.video_url && (
                <div className="mt-6 aspect-video bg-black/5 rounded-xl overflow-hidden flex items-center justify-center relative group">
                  <a href={product.video_url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 text-[hsl(var(--muted))] hover:text-emerald-600 transition-colors z-10">
                    <div className="w-16 h-16 bg-[hsl(var(--surface))] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Video size={24} />
                    </div>
                    <span className="font-medium bg-[hsl(var(--background))] px-3 py-1 rounded-full shadow-sm mt-2">انقر لمشاهدة الفيديو في صفحة جديدة</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Delivery */}
          {activeTab === 'delivery' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">طريقة الشحن والتسليم للعميل</h3>
              <p className="text-sm text-[hsl(var(--muted))] mb-4">اشرح خطوات تسليم هذا المنتج للعميل بعد إتمام البيع.</p>
              
              <textarea
                id="delivery_input"
                className="form-input w-full min-h-[200px]"
                defaultValue={product.delivery_method || ''}
                placeholder="1. تفعيل الحساب...\n2. إرسال الإيميل الترحيبي...\n3. ترتيب اجتماع التدريب..."
              />
              
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const val = (document.getElementById('delivery_input') as HTMLTextAreaElement).value;
                    handleUpdateField('delivery_method', val);
                  }}
                  className="btn-primary px-6 flex items-center gap-2"
                >
                  <Save size={16} /> حفظ الطريقة
                </button>
                {product.delivery_method && (
                  <button 
                    onClick={() => {
                      if(confirm('هل أنت متأكد من حذف هذه البيانات؟')) {
                        (document.getElementById('delivery_input') as HTMLTextAreaElement).value = '';
                        handleUpdateField('delivery_method', '');
                      }
                    }}
                    className="btn-secondary text-red-500 hover:text-red-600 flex items-center gap-2"
                  >
                    <Trash2 size={16} /> مسح
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Invoices & Clients */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <h3 className="font-bold text-lg">الفواتير التي تتضمن هذا المنتج</h3>
              {(!product.invoices || product.invoices.length === 0) ? (
                <div className="text-center py-12 bg-[hsl(var(--surface))] rounded-xl border border-[hsl(var(--border))]">
                  <Receipt size={40} className="mx-auto text-[hsl(var(--muted))] mb-3" />
                  <p className="text-[hsl(var(--muted))]">لم يتم بيع هذا المنتج بعد أو لم يُربط بأي فاتورة.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[hsl(var(--border))]">
                        <th className="py-3 px-4 text-start">رقم الفاتورة</th>
                        <th className="py-3 px-4 text-start">العميل</th>
                        <th className="py-3 px-4 text-start">التاريخ</th>
                        <th className="py-3 px-4 text-start">الحالة</th>
                        <th className="py-3 px-4 text-start">القيمة الإجمالية للفاتورة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.invoices.map((inv: any) => (
                        <tr key={inv.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--surface))] transition-colors">
                          <td className="py-3 px-4 font-medium text-emerald-600">
                            <button onClick={() => navigate(`/invoices/${inv.id}`)} className="hover:underline">
                              {inv.invoice_number}
                            </button>
                          </td>
                          <td className="py-3 px-4">{inv.client?.company_name || inv.client?.name || 'غير معروف'}</td>
                          <td className="py-3 px-4">{new Date(inv.issue_date).toLocaleDateString('ar-SA')}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                              inv.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {inv.status === 'paid' ? 'مدفوعة' : inv.status === 'sent' ? 'مرسلة' : 'مسودة'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold">{Number(inv.total).toLocaleString()} د.إ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
