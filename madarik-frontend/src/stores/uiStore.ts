import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  // Theme
  darkMode: boolean
  toggleDarkMode: () => void

  // Language / Direction
  locale: 'ar' | 'en'
  dir: 'rtl' | 'ltr'
  setLocale: (locale: 'ar' | 'en') => void

  // Sidebar
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  collapseSidebar: () => void

  // Page loader
  loading: boolean
  setLoading: (v: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => {
        const next = !get().darkMode
        set({ darkMode: next })
        document.documentElement.classList.toggle('dark', next)
      },

      locale: 'ar',
      dir: 'rtl',
      setLocale: (locale) => {
        const dir = locale === 'ar' ? 'rtl' : 'ltr'
        set({ locale, dir })
        document.documentElement.setAttribute('lang', locale)
        document.documentElement.setAttribute('dir', dir)
      },

      sidebarOpen: true,
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      collapseSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      loading: false,
      setLoading: (v) => set({ loading: v }),
    }),
    {
      name: 'madarik-ui',
      partialize: (state) => ({
        darkMode: state.darkMode,
        locale: state.locale,
        dir: state.dir,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
