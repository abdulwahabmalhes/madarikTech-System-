import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import {
  Users, Plus, Search, Phone, MessageCircle,
  MapPin, Building2, Mail, Filter, TrendingUp
} from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '', label: 'كل العملاء' },
  { value: 'active', label: 'نشط' },
  { value: 'on-hold', label: 'موقوف' },
  { value: 'closed', label: 'مغلق' },
]

const TYPE_MAP: Record<string, string> = {
  company: 'شركة', individual: 'فرد'
}

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [view, setView] = useState<'grid' | 'table'>('grid')
  
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', company_name: '', mobile: '', email: '', type: 'company', source: '' })
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/clients', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      setShowAdd(false)
      setForm({ name: '', company_name: '', mobile: '', email: '', type: 'company', source: '' })
    }
  })

  const { data, isLoading } = useQuery({
    queryKey: ['clients', search, status],
    queryFn: () =>
      api.get('/clients', {
        params: { per_page: 50, search: search || undefined, status: status || undefined },
      }).then(r => r.data),
  })

  const clients = data?.data ?? []

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">العملاء</h2>
          <p className="text-sm text-[hsl(var(--muted))]">{clients.length} عميل مسجّل</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> إضافة عميل
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-[hsl(var(--muted))]" />
          <input
            type="text"
            placeholder="البحث بالاسم أو الجوال..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-input ps-9 h-9 py-2"
          />
        </div>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="form-input h-9 py-2 w-40"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="flex gap-1 border border-[hsl(var(--border))] rounded-lg p-0.5 bg-[hsl(var(--surface))]">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'grid' ? 'bg-emerald-600 text-white' : 'text-[hsl(var(--muted))]'}`}
          >شبكة</button>
          <button
            onClick={() => setView('table')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'table' ? 'bg-emerald-600 text-white' : 'text-[hsl(var(--muted))]'}`}
          >جدول</button>
        </div>
      </div>

      {/* Grid View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card p-5 h-48 animate-pulse bg-[hsl(var(--border))]" />
          ))}
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {clients.map((client: any) => (
            <div
              key={client.id}
              className="glass-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block cursor-pointer"
              onClick={() => window.location.href = `/clients/${client.id}`}
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {client.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-[hsl(var(--foreground))] truncate">{client.name}</div>
                  <div className="text-xs font-mono text-[hsl(var(--muted))] mt-0.5 mb-1">{client.client_code || 'بدون كود'}</div>
                  {client.company_name && (
                    <div className="text-xs text-[hsl(var(--muted))] flex items-center gap-1 truncate">
                      <Building2 size={11} /> {client.company_name}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1.5 mb-3">
                {client.mobile && (
                  <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted))]">
                    <Phone size={12} /> <span dir="ltr">{client.mobile}</span>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted))] truncate">
                    <Mail size={12} /> {client.email}
                  </div>
                )}
                {(client.city || client.country) && (
                  <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted))]">
                    <MapPin size={12} /> {[client.city, client.country].filter(Boolean).join('، ')}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--border))]">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  client.status === 'active' ? 'badge-success' :
                  client.status === 'on-hold' ? 'badge-warning' : 'badge-gray'
                }`}>
                  {client.status === 'active' ? 'نشط' : client.status === 'on-hold' ? 'موقوف' : 'مغلق'}
                </span>
                <div className="flex gap-1">
                  {client.mobile && (
                    <a
                      href={`tel:${client.mobile}`}
                      onClick={e => e.stopPropagation()}
                      className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] hover:text-emerald-600 transition-colors"
                    >
                      <Phone size={13} />
                    </a>
                  )}
                  {(client.whatsapp || client.mobile) && (
                    <a
                      href={`https://wa.me/${(client.whatsapp || client.mobile).replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] hover:text-emerald-600 transition-colors"
                    >
                      <MessageCircle size={13} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-card overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="p-4 text-start font-semibold text-[hsl(var(--muted))]">اسم العميل والكود</th>
                <th className="p-4 text-start font-semibold text-[hsl(var(--muted))]">الشركة / النشاط</th>
                <th className="p-4 text-start font-semibold text-[hsl(var(--muted))]">التواصل</th>
                <th className="p-4 text-start font-semibold text-[hsl(var(--muted))]">النوع</th>
                <th className="p-4 text-start font-semibold text-[hsl(var(--muted))]">الحالة</th>
                <th className="p-4 text-start font-semibold text-[hsl(var(--muted))]">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {clients.map((client: any) => (
                <tr key={client.id} className="hover:bg-[hsl(var(--surface))] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500/20 to-green-500/20 flex items-center justify-center text-emerald-600 font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <Link to={`/clients/${client.id}`} className="font-bold text-[hsl(var(--foreground))] hover:text-emerald-600 transition-colors">
                          {client.name}
                        </Link>
                        <div className="text-xs text-[hsl(var(--muted))] mt-0.5">{client.client_code || 'بدون كود'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-[hsl(var(--muted))] text-xs" dir="ltr">
                    {client.company_name && <div className="font-medium text-[hsl(var(--foreground))]">{client.company_name}</div>}
                  </td>
                  <td className="text-[hsl(var(--muted))] text-xs" dir="ltr">{client.mobile}</td>
                  <td className="text-[hsl(var(--muted))] text-xs">{[client.city, client.country].filter(Boolean).join('، ')}</td>
                  <td className="text-[hsl(var(--muted))] text-xs">{client.source}</td>
                  <td className="text-xs">{TYPE_MAP[client.type] ?? client.type}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      client.status === 'active' ? 'badge-success' :
                      client.status === 'on-hold' ? 'badge-warning' : 'badge-gray'
                    }`}>
                      {client.status === 'active' ? 'نشط' : client.status === 'on-hold' ? 'موقوف' : 'مغلق'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <a href={`tel:${client.mobile}`} className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] hover:text-emerald-600 transition-colors">
                        <Phone size={13} />
                      </a>
                      <a href={`https://wa.me/${client.mobile?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                        className="p-1.5 rounded-lg hover:bg-[hsl(var(--surface-hover))] text-[hsl(var(--muted))] hover:text-emerald-600 transition-colors">
                        <MessageCircle size={13} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clients.length === 0 && (
            <div className="text-center py-12 text-[hsl(var(--muted))]">لا يوجد عملاء مطابقون</div>
          )}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="إضافة عميل جديد">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">النوع</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="form-input">
              <option value="company">شركة</option>
              <option value="individual">فرد</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">اسم العميل (جهة الاتصال)</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" placeholder="اسم جهة الاتصال الأساسية" />
          </div>
          {form.type === 'company' && (
            <div>
              <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">اسم الشركة</label>
              <input value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} className="form-input" placeholder="اسم الشركة" />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">رقم الجوال</label>
            <input value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} className="form-input" dir="ltr" placeholder="+971..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">البريد الإلكتروني</label>
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="form-input" dir="ltr" placeholder="email@example.com" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button className="btn-secondary" onClick={() => setShowAdd(false)}>إلغاء</button>
            <button 
              className="btn-primary" 
              onClick={() => addMutation.mutate(form)}
              disabled={!form.name || !form.mobile || addMutation.isPending}
            >
              {addMutation.isPending ? 'جارٍ الحفظ...' : 'حفظ'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
