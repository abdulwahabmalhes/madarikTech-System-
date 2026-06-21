import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@madariktech.com',
      password: 'password123',
    },
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => api.post('/auth/login', data),
    onSuccess: (response) => {
      const { user, token } = response.data
      setAuth(user, token)
      navigate('/dashboard')
    },
    onError: (error: any) => {
      setServerError(
        error?.response?.data?.message ??
        'حدث خطأ، يرجى المحاولة مرة أخرى.'
      )
    },
  })

  const onSubmit = (data: LoginForm) => {
    setServerError('')
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234B9FE1' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg shadow-emerald-500/30">
              م
            </div>
            <h1 className="text-2xl font-bold text-white">مدارك تك</h1>
            <p className="text-white/50 text-sm mt-1">Business Operating System</p>
          </div>

          {/* Islamic Banner */}
          <div className="text-center mb-6">
            <p className="text-white/40 text-xs font-arabic">بسم الله الرحمن الرحيم</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                placeholder="admin@madariktech.com"
                dir="ltr"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 end-3 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-300 text-sm text-center">{serverError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>جارٍ تسجيل الدخول...</span>
                </>
              ) : 'تسجيل الدخول'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/30 text-xs">
              Madarik Tech Business OS v1.0
            </p>
            <p className="text-white/20 text-xs mt-1">
              جميع الحقوق محفوظة © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
