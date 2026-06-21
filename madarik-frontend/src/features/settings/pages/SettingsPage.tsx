import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Settings, Building2, DollarSign, Image as ImageIcon, QrCode } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const formRef = useRef<HTMLFormElement>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      formData.append('_method', 'PUT') // Laravel requires this for multipart/form-data PUT requests
      
      const token = localStorage.getItem('madarik_token')
      const response = await fetch('http://localhost:8000/api/v1/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to save')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      alert('تم حفظ الإعدادات بنجاح')
    }
  })

  const settings = data ?? {}

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    
    // Remove empty file inputs so they don't overwrite existing ones
    const logoFile = formData.get('logo_path') as File
    if (logoFile && logoFile.size > 2 * 1024 * 1024) {
      alert('حجم اللوغو كبير جداً، يجب أن يكون أقل من 2 ميغابايت.')
      return
    }
    if (!logoFile || logoFile.size === 0) formData.delete('logo_path')
    
    const qrFile = formData.get('qr_code') as File
    if (qrFile && qrFile.size > 2 * 1024 * 1024) {
      alert('حجم الكيو آر كود كبير جداً، يجب أن يكون أقل من 2 ميغابايت.')
      return
    }
    if (!qrFile || qrFile.size === 0) formData.delete('qr_code')

    updateMutation.mutate(formData)
  }

  if (isLoading) return <div className="p-8">جاري التحميل...</div>

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-4xl pb-10">
      <div>
        <h2 className="text-xl font-bold text-[hsl(var(--foreground))]">الإعدادات</h2>
        <p className="text-sm text-[hsl(var(--muted))]">إعدادات النظام والشركة</p>
      </div>

      {/* Company Info */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Building2 size={18} className="text-emerald-600" />
          <h3 className="font-semibold text-[hsl(var(--foreground))]">معلومات الشركة</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">اسم الشركة (عربي)</label>
            <input name="company_name_ar" defaultValue={settings.company_name_ar} className="form-input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">اسم الشركة (إنجليزي)</label>
            <input name="company_name_en" defaultValue={settings.company_name_en} className="form-input" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">رقم الرخصة (السجل)</label>
            <input name="license_number" defaultValue={settings.license_number} className="form-input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">رقم الشركة</label>
            <input name="company_number" defaultValue={settings.company_number} className="form-input" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">اسم المدير العام</label>
            <input name="manager_name" defaultValue={settings.manager_name} className="form-input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">رقم جوال المدير</label>
            <input name="manager_phone" defaultValue={settings.manager_phone} className="form-input" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">البريد الإلكتروني للشركة</label>
            <input name="email" defaultValue={settings.email} className="form-input" dir="ltr" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[hsl(var(--muted))] mb-1.5">العنوان</label>
            <input name="address" defaultValue={settings.address} className="form-input" />
          </div>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t border-[hsl(var(--border))] pt-6">
          {/* Logo */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
              <ImageIcon size={16} className="text-emerald-500" /> شعار الشركة (Logo)
            </label>
            <p className="text-xs text-[hsl(var(--muted))]">سيتم استخدام الشعار في ترويسة جميع ملفات الـ PDF</p>
            {(settings.logo_path || settings.logo) && (
              <img src={'http://localhost:8000' + (settings.logo_path || settings.logo)} alt="Logo" className="h-16 object-contain rounded border border-gray-200 bg-white p-1" />
            )}
            <input type="file" name="logo_path" accept="image/*" className="form-input text-sm" />
          </div>

          {/* QR Code */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
              <QrCode size={16} className="text-emerald-500" /> رمز الاستجابة السريعة (QR Code)
            </label>
            <p className="text-xs text-[hsl(var(--muted))]">ارفع صورة الباركود الخاصة بالشركة لتظهر في التقارير</p>
            {settings.qr_code && (
              <img src={'http://localhost:8000' + settings.qr_code} alt="QR Code" className="h-16 w-16 object-contain rounded border border-gray-200 bg-white p-1" />
            )}
            <input type="file" name="qr_code" accept="image/*" className="form-input text-sm" />
          </div>
        </div>
      </div>

      <div className="flex justify-end sticky bottom-4 z-10">
        <button type="submit" className="btn-primary shadow-lg shadow-emerald-500/20 px-8 py-2.5 text-base" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات بالكامل'}
        </button>
      </div>
    </form>
  )
}
