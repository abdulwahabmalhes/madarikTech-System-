<?php

namespace App\Http\Controllers\Api\V1\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Payment;
use App\Models\Project;
use App\Models\Task;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $startOfYear = $now->copy()->startOfYear();

        // Revenue KPIs
        $totalRevenueMtd = Payment::where('tenant_id', $tenantId)
            ->whereBetween('payment_date', [$startOfMonth, $endOfMonth])
            ->sum('amount');

        $totalRevenueYtd = Payment::where('tenant_id', $tenantId)
            ->whereBetween('payment_date', [$startOfYear, $now])
            ->sum('amount');

        $totalOutstanding = Invoice::where('tenant_id', $tenantId)
            ->whereIn('status', ['sent', 'overdue', 'partial'])
            ->sum('remaining_amount');

        $overdueAmount = Invoice::where('tenant_id', $tenantId)
            ->where('status', 'overdue')
            ->sum('remaining_amount');

        // Projects
        $activeProjects = Project::where('tenant_id', $tenantId)
            ->where('status', 'in-progress')
            ->count();

        $overdueProjects = Project::where('tenant_id', $tenantId)
            ->where('status', 'in-progress')
            ->where('expected_end_date', '<', $now)
            ->count();

        $projectsAtRisk = Project::where('tenant_id', $tenantId)
            ->where('health_score', '<', 60)
            ->count();

        // CRM
        $newLeadsThisMonth = Lead::where('tenant_id', $tenantId)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();

        $leadsInPipeline = Lead::where('tenant_id', $tenantId)
            ->whereNotIn('stage', ['won', 'lost'])
            ->count();

        $pipelineValue = Lead::where('tenant_id', $tenantId)
            ->whereNotIn('stage', ['won', 'lost'])
            ->sum('estimated_value');

        // Tasks
        $tasksDueToday = Task::where('tenant_id', $tenantId)
            ->where('due_date', $now->toDateString())
            ->where('status', '!=', 'completed')
            ->count();

        $overdueTasksCount = Task::where('tenant_id', $tenantId)
            ->where('due_date', '<', $now->toDateString())
            ->where('status', '!=', 'completed')
            ->count();

        // Expenses
        $totalExpensesMtd = Expense::where('tenant_id', $tenantId)
            ->whereBetween('date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->sum('amount');

        // Active projects details
        $activeProjectsList = Project::where('tenant_id', $tenantId)
            ->where('status', 'in-progress')
            ->with(['client:id,name,company_name', 'manager:id,name'])
            ->orderBy('health_score')
            ->limit(5)
            ->get(['id', 'name', 'client_id', 'assigned_manager', 'progress_percent', 'health_score', 'expected_end_date', 'contract_value', 'status', 'priority']);

        // Recent leads
        $recentLeads = Lead::where('tenant_id', $tenantId)
            ->with('assignedUser:id,name')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'name', 'company_name', 'source', 'stage', 'estimated_value', 'created_at', 'assigned_to']);

        // Approaching deadlines (Projects)
        $approachingDeadlines = Project::where('tenant_id', $tenantId)
            ->where('status', 'in-progress')
            ->whereNotNull('expected_end_date')
            ->where('expected_end_date', '>=', $now->toDateString())
            ->with(['client:id,name,company_name'])
            ->orderBy('expected_end_date', 'asc')
            ->limit(5)
            ->get(['id', 'name', 'client_id', 'progress_percent', 'health_score', 'expected_end_date', 'status']);

        // Monthly revenue chart (last 6 months)
        $monthlyRevenue = collect();
        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $revenue = Payment::where('tenant_id', $tenantId)
                ->whereYear('payment_date', $month->year)
                ->whereMonth('payment_date', $month->month)
                ->sum('amount');

            $expenses = Expense::where('tenant_id', $tenantId)
                ->whereYear('date', $month->year)
                ->whereMonth('date', $month->month)
                ->sum('amount');

            $monthlyRevenue->push([
                'month'    => $month->format('Y-m'),
                'label'    => $month->translatedFormat('M Y'),
                'revenue'  => round($revenue, 2),
                'expenses' => round($expenses, 2),
                'profit'   => round($revenue - $expenses, 2),
            ]);
        }

        // Lead sources for current month
        $leadSources = Lead::where('tenant_id', $tenantId)
            ->whereYear('created_at', $now->year)
            ->whereMonth('created_at', $now->month)
            ->selectRaw('source, COUNT(*) as count')
            ->groupBy('source')
            ->orderByDesc('count')
            ->get();

        return response()->json([
            'kpis' => [
                'revenue_mtd'        => round($totalRevenueMtd, 2),
                'revenue_ytd'        => round($totalRevenueYtd, 2),
                'outstanding'        => round($totalOutstanding, 2),
                'overdue_amount'     => round($overdueAmount, 2),
                'active_projects'    => $activeProjects,
                'overdue_projects'   => $overdueProjects,
                'projects_at_risk'   => $projectsAtRisk,
                'new_leads_mtd'      => $newLeadsThisMonth,
                'leads_in_pipeline'  => $leadsInPipeline,
                'pipeline_value'     => round($pipelineValue, 2),
                'tasks_due_today'    => $tasksDueToday,
                'overdue_tasks'      => $overdueTasksCount,
                'expenses_mtd'       => round($totalExpensesMtd, 2),
                'net_profit_mtd'     => round($totalRevenueMtd - $totalExpensesMtd, 2),
            ],
            'active_projects'        => $activeProjectsList,
            'approaching_deadlines'  => $approachingDeadlines,
            'recent_leads'           => $recentLeads,
            'monthly_chart'          => $monthlyRevenue,
            'lead_sources'           => $leadSources,
        ]);
    }

    public function kpis(Request $request): JsonResponse
    {
        $tenantId = $request->user()->tenant_id;
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        return response()->json([
            'revenue_mtd' => Payment::where('tenant_id', $tenantId)
                ->whereBetween('payment_date', [$startOfMonth, $endOfMonth])
                ->sum('amount'),
            'outstanding' => Invoice::where('tenant_id', $tenantId)
                ->whereIn('status', ['sent', 'overdue'])->sum('remaining_amount'),
            'active_projects' => Project::where('tenant_id', $tenantId)->where('status', 'in-progress')->count(),
            'leads_pipeline'  => Lead::where('tenant_id', $tenantId)->whereNotIn('stage', ['won', 'lost'])->count(),
        ]);
    }
}
