import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'

// Layouts
import AppLayout from '@/components/layout/AppLayout'

import LoginPage from '@/features/auth/pages/LoginPage'
import ClientTrackingPage from '@/features/tracking/pages/ClientTrackingPage'

// Dashboard
import DashboardPage from '@/features/dashboard/pages/DashboardPage'

// CRM
import CrmPage from '@/features/crm/pages/CrmPage'
import LeadDetailPage from '@/features/crm/pages/LeadDetailPage'

// Clients
import ClientsPage from '@/features/clients/pages/ClientsPage'
import ClientDetailPage from '@/features/clients/pages/ClientDetailPage'

// Projects
import ProjectsPage from '@/features/projects/pages/ProjectsPage'
import ProjectDetailPage from '@/features/projects/pages/ProjectDetailPage'

// Tasks
import TasksPage from '@/features/tasks/pages/TasksPage'

// Finance
import QuotationsPage from '@/features/quotations/pages/QuotationsPage'
import QuotationDetailPage from '@/features/quotations/pages/QuotationDetailPage'
import ContractsPage from '@/features/contracts/pages/ContractsPage'
import ContractDetailPage from '@/features/contracts/pages/ContractDetailPage'
import InvoicesPage from '@/features/invoices/pages/InvoicesPage'
import InvoiceDetailPage from '@/features/invoices/pages/InvoiceDetailPage'
import ExpensesPage from '@/features/expenses/pages/ExpensesPage'
import IncomesPage from '@/features/financials/pages/IncomesPage'

// Reports & Meetings
import DailyReportsPage from '@/features/reports/pages/DailyReportsPage'
import MeetingsPage from '@/features/meetings/pages/MeetingsPage'

// Other Modules
import ProductsPage from '@/features/products/pages/ProductsPage'
import ProductDetailPage from '@/features/products/pages/ProductDetailPage'
import RenewalsPage from '@/features/renewals/pages/RenewalsPage'
import GoalsPage from '@/features/goals/pages/GoalsPage'
import AssetsPage from '@/features/assets/pages/AssetsPage'
import SupportPage from '@/features/support/pages/SupportPage'
import CalendarPage from '@/features/calendar/pages/CalendarPage'
import TeamPage from '@/features/team/pages/TeamPage'
import RolesPage from '@/features/team/pages/RolesPage'
import KnowledgePage from '@/features/knowledge/pages/KnowledgePage'
import SettingsPage from '@/features/settings/pages/SettingsPage'
import NotificationsPage from '@/features/notifications/pages/NotificationsPage'

// Analytics
import ProfitLossPage from '@/features/analytics/pages/ProfitLossPage'
import CashFlowPage from '@/features/analytics/pages/CashFlowPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/track" element={<ClientTrackingPage />} />

        {/* Protected — inside AppLayout */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* CRM */}
          <Route path="crm" element={<CrmPage />} />
          <Route path="crm/leads/:id" element={<LeadDetailPage />} />

          {/* Clients */}
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />

          {/* Projects */}
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />

          {/* Tasks */}
          <Route path="tasks" element={<TasksPage />} />

          {/* Finance */}
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="quotations/:id" element={<QuotationDetailPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="contracts/:id" element={<ContractDetailPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="incomes" element={<IncomesPage />} />

          {/* Reports & Meetings */}
          <Route path="daily-reports" element={<DailyReportsPage />} />
          <Route path="meetings" element={<MeetingsPage />} />

          {/* Other Modules */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="renewals" element={<RenewalsPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="team/roles" element={<RolesPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />

          {/* Analytics */}
          <Route path="analytics/profit-loss" element={<ProfitLossPage />} />
          <Route path="analytics/cash-flow" element={<CashFlowPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
