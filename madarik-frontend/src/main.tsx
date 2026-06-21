import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Apply persisted UI settings before render
const uiRaw = localStorage.getItem('madarik-ui')
if (uiRaw) {
  try {
    const ui = JSON.parse(uiRaw)?.state
    if (ui?.darkMode) document.documentElement.classList.add('dark')
    const locale = ui?.locale ?? 'ar'
    const dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('lang', locale)
    document.documentElement.setAttribute('dir', dir)
  } catch {
    document.documentElement.setAttribute('lang', 'ar')
    document.documentElement.setAttribute('dir', 'rtl')
  }
} else {
  document.documentElement.setAttribute('lang', 'ar')
  document.documentElement.setAttribute('dir', 'rtl')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
