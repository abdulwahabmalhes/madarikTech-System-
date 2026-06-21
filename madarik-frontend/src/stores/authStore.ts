import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  name: string
  name_ar: string
  email: string
  position: string | null
  department: string | null
  mobile: string | null
  avatar: string | null
  is_active: boolean
  roles: string[]
  permissions: string[]
  tenant_id: number
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('madarik_token', token)
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('madarik_token')
        localStorage.removeItem('madarik_user')
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (partial) => {
        const current = get().user
        if (current) {
          set({ user: { ...current, ...partial } })
        }
      },

      hasPermission: (permission: string) => {
        const { user } = get()
        if (!user) return false
        if (user.roles.includes('owner') || user.roles.includes('super-admin')) return true
        return user.permissions.includes(permission)
      },

      hasRole: (role: string) => {
        const { user } = get()
        if (!user) return false
        return user.roles.includes(role)
      },
    }),
    {
      name: 'madarik-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
