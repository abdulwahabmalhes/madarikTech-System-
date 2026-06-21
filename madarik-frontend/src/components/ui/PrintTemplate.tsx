import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface PrintTemplateProps {
  children: React.ReactNode
  title?: string
}

export function PrintTemplate({ children, title }: PrintTemplateProps) {
  const { data: settings = {} } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then(r => r.data),
  })

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return 'http://localhost:8000/' + (cleanPath.startsWith('storage') ? '' : 'storage/') + cleanPath;
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] text-black dark:text-white relative" id="print-area">
      
      {/* Header / Letterhead for Print */}
      <div className="hidden print:block border-b-2 border-gray-800 pb-6 mb-8 pt-4">
        <div className="flex justify-between items-start">
          
          {/* Right side: Logo & Names */}
          <div className="flex items-center gap-4">
            {(settings.logo_path || settings.logo) ? (
              <img src={getImageUrl(settings.logo_path || settings.logo)} alt="Logo" className="w-20 h-20 object-contain rounded" />
            ) : (
              <div className="w-16 h-16 bg-gray-900 rounded flex items-center justify-center text-white font-bold text-2xl">
                {settings.company_name_ar ? settings.company_name_ar.charAt(0) : 'M'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{settings.company_name_ar || 'شركة مدارك التقنية'}</h1>
              {settings.company_name_en && (
                <p className="text-gray-600 font-medium text-sm mt-1">{settings.company_name_en}</p>
              )}
              {settings.license_number && (
                <p className="text-gray-500 text-xs mt-1">رقم السجل: {settings.license_number}</p>
              )}
              {settings.company_number && (
                <p className="text-gray-500 text-xs">رقم الشركة: {settings.company_number}</p>
              )}
            </div>
          </div>

          {/* Left side: QR Code & Contact */}
          <div className="flex items-center gap-4">
             <div className="text-left text-sm text-gray-700 space-y-1 font-medium" dir="ltr">
               {settings.email && <div>{settings.email}</div>}
               {settings.manager_phone && <div>{settings.manager_phone}</div>}
               {settings.manager_name && <div dir="rtl" className="font-bold text-gray-900 mt-1">إدارة: {settings.manager_name}</div>}
             </div>
             {settings.qr_code && (
               <img src={getImageUrl(settings.qr_code)} alt="QR Code" className="w-16 h-16 object-contain rounded" />
             )}
          </div>
          
        </div>
      </div>

      {/* Document Title */}
      {title && (
        <div className="text-center mb-8 print:mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white print:text-black uppercase tracking-wider">
            {title}
          </h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto mt-3 print:bg-gray-800"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="print-content">
        {children}
      </div>

      {/* Print Footer */}
      <div className="mt-16 pt-4 border-t-2 border-gray-800 text-center hidden print:block print:break-inside-avoid">
        <p className="text-sm font-bold text-gray-900 mb-1">تم إصدار هذا المستند رسمياً من نظام إدارة - {settings.company_name_ar || 'شركة مدارك التقنية'}</p>
        <p className="text-xs text-gray-500">هذا المستند موجه للعميل المذكور ويعتبر تقريراً دورياً لسير العمل.</p>
      </div>
    </div>
  )
}
