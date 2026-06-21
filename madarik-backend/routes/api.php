<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Dashboard\DashboardController;
use App\Http\Controllers\Api\V1\Crm\LeadController;
use App\Http\Controllers\Api\V1\Clients\ClientController;
use App\Http\Controllers\Api\V1\Projects\ProjectController;
use App\Http\Controllers\Api\V1\Projects\MilestoneController;
use App\Http\Controllers\Api\V1\Tasks\TaskController;
use App\Http\Controllers\Api\V1\Quotations\QuotationController;
use App\Http\Controllers\Api\V1\Contracts\ContractController;
use App\Http\Controllers\Api\V1\Invoices\InvoiceController;
use App\Http\Controllers\Api\V1\Invoices\PaymentController;
use App\Http\Controllers\Api\V1\Expenses\ExpenseController;
use App\Http\Controllers\Api\V1\Reports\DailyReportController;
use App\Http\Controllers\Api\V1\Products\ProductController;
use App\Http\Controllers\Api\V1\Products\ProductCategoryController;
use App\Http\Controllers\Api\V1\Meetings\MeetingController;
use App\Http\Controllers\Api\V1\Deliverables\DeliverableController;
use App\Http\Controllers\Api\V1\Renewals\RenewalController;
use App\Http\Controllers\Api\V1\Goals\GoalController;
use App\Http\Controllers\Api\V1\Assets\AssetController;
use App\Http\Controllers\Api\V1\Support\SupportTicketController;
use App\Http\Controllers\Api\V1\Opportunities\OpportunityController;
use App\Http\Controllers\Api\V1\Reminders\ReminderController;
use App\Http\Controllers\Api\V1\Knowledge\KnowledgeController;
use App\Http\Controllers\Api\V1\Calendar\CalendarController;
use App\Http\Controllers\Api\V1\Team\TeamController;
use App\Http\Controllers\Api\V1\Analytics\ProfitLossController;
use App\Http\Controllers\Api\V1\Analytics\CashFlowController;
use App\Http\Controllers\Api\V1\Pdf\PdfController;
use App\Http\Controllers\Api\V1\Files\FileController;
use App\Http\Controllers\Api\V1\Notifications\NotificationController;
use App\Http\Controllers\Api\V1\Settings\SettingsController;
use App\Http\Controllers\Api\V1\Ai\AiAssistantController;
use App\Http\Controllers\Api\V1\Crm\MarketingSpendController;

/*
|--------------------------------------------------------------------------
| API Routes — Madarik Tech Business OS
|--------------------------------------------------------------------------
*/

// Public: Auth & Tracking
Route::prefix('v1/auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});

// Public: Client Tracking
Route::post('v1/track/login', [\App\Http\Controllers\Api\V1\Clients\ClientTrackingController::class, 'track']);

// Protected: All app routes
Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {

    // Auth
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::put('auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('auth/password', [AuthController::class, 'changePassword']);

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);
    Route::get('dashboard/kpis', [DashboardController::class, 'kpis']);

    // CRM - Leads
    Route::apiResource('leads', LeadController::class);
    Route::post('leads/{lead}/convert', [LeadController::class, 'convert']);
    Route::get('leads/analytics/sources', [LeadController::class, 'sourceAnalytics']);
    Route::apiResource('marketing-spend', MarketingSpendController::class);

    // Clients
    Route::apiResource('clients', ClientController::class);
    Route::post('clients/{client}/invite-portal', [ClientController::class, 'invitePortal']);
    Route::get('clients/{client}/timeline', [ClientController::class, 'timeline']);
    Route::get('clients/{client}/financials', [ClientController::class, 'financials']);
    Route::get('clients/{client}/projects', [ClientController::class, 'projects']);

    // Projects
    Route::apiResource('projects', ProjectController::class);
    Route::get('projects/{project}/health', [ProjectController::class, 'health']);
    Route::get('projects/{project}/financials', [ProjectController::class, 'financials']);
    Route::post('projects/{project}/update-health', [ProjectController::class, 'updateHealth']);
    Route::apiResource('projects.milestones', MilestoneController::class)->shallow();

    // Tasks
    Route::apiResource('tasks', TaskController::class);
    Route::post('tasks/{task}/complete', [TaskController::class, 'complete']);
    Route::post('tasks/{task}/reopen', [TaskController::class, 'reopen']);

    // Quotations
    Route::apiResource('quotations', QuotationController::class);
    Route::post('quotations/{quotation}/send', [QuotationController::class, 'send']);
    Route::post('quotations/{quotation}/accept', [QuotationController::class, 'accept']);
    Route::post('quotations/{quotation}/reject', [QuotationController::class, 'reject']);
    Route::post('quotations/{quotation}/convert', [QuotationController::class, 'convert']);
    Route::post('quotations/{quotation}/pdf', [QuotationController::class, 'generatePdf']);

    // Contracts
    Route::apiResource('contracts', ContractController::class);
    Route::post('contracts/{contract}/pdf', [ContractController::class, 'generatePdf']);
    Route::post('contracts/{contract}/sign', [ContractController::class, 'markSigned']);
    Route::post('contracts/{contract}/convert-to-invoice', [ContractController::class, 'convertToInvoice']);

    // Invoices
    Route::apiResource('invoices', InvoiceController::class);
    Route::post('invoices/{invoice}/send', [InvoiceController::class, 'send']);
    Route::post('invoices/{invoice}/mark-paid', [InvoiceController::class, 'markPaid']);
    Route::post('invoices/{invoice}/pdf', [InvoiceController::class, 'generatePdf']);
    Route::apiResource('invoices.payments', PaymentController::class)->shallow();

    // Expenses
    Route::apiResource('expenses', ExpenseController::class);

    // Incomes
    Route::apiResource('incomes', \App\Http\Controllers\Api\V1\Financials\IncomeController::class);

    // Renewals
    Route::apiResource('renewals', \App\Http\Controllers\Api\V1\RenewalController::class);



    // Daily Reports
    Route::apiResource('daily-reports', DailyReportController::class);
    Route::post('daily-reports/{dailyReport}/send', [DailyReportController::class, 'send']);
    Route::post('daily-reports/{dailyReport}/pdf', [DailyReportController::class, 'generatePdf']);

    // Products & Categories
    Route::apiResource('products', ProductController::class);
    Route::apiResource('product-categories', ProductCategoryController::class);

    // Meetings
    Route::apiResource('meetings', MeetingController::class);
    Route::post('meetings/{meeting}/pdf', [MeetingController::class, 'generatePdf']);
    Route::post('meetings/{meeting}/send', [MeetingController::class, 'send']);

    // Deliverables
    Route::apiResource('deliverables', DeliverableController::class);
    Route::post('deliverables/{deliverable}/approve', [DeliverableController::class, 'approve']);

    // Renewals
    Route::apiResource('renewals', RenewalController::class);
    Route::post('renewals/{renewal}/renew', [RenewalController::class, 'markRenewed']);

    // Goals
    Route::apiResource('goals', GoalController::class);
    Route::get('goals/progress', [GoalController::class, 'progress']);

    // Assets
    Route::apiResource('assets', AssetController::class);

    // Support Tickets
    Route::apiResource('support-tickets', SupportTicketController::class);
    Route::post('support-tickets/{ticket}/assign', [SupportTicketController::class, 'assign']);
    Route::post('support-tickets/{ticket}/close', [SupportTicketController::class, 'close']);
    Route::post('support-tickets/{ticket}/comments', [SupportTicketController::class, 'addComment']);

    // Opportunities
    Route::apiResource('opportunities', OpportunityController::class);

    // Reminders
    Route::apiResource('reminders', ReminderController::class);

    // Knowledge Base
    Route::apiResource('knowledge-categories', KnowledgeController::class . '@indexCategories');
    Route::apiResource('knowledge', KnowledgeController::class);

    // Calendar
    Route::get('calendar', [CalendarController::class, 'index']);
    Route::post('calendar', [CalendarController::class, 'store']);
    Route::put('calendar/{event}', [CalendarController::class, 'update']);
    Route::delete('calendar/{event}', [CalendarController::class, 'destroy']);

    // Team
    Route::get('team', [TeamController::class, 'index']);
    Route::post('team/invite', [TeamController::class, 'invite']);
    Route::put('team/{user}', [TeamController::class, 'update']);
    Route::delete('team/{user}', [TeamController::class, 'deactivate']);

    // Analytics
    Route::get('analytics/profit-loss', [ProfitLossController::class, 'index']);
    Route::get('analytics/profit-loss/project/{project}', [ProfitLossController::class, 'byProject']);
    Route::get('analytics/cash-flow', [CashFlowController::class, 'index']);
    Route::get('analytics/lead-sources', [LeadController::class, 'sourceAnalytics']);

    // Files
    Route::post('files/upload', [FileController::class, 'upload']);
    Route::delete('files/{file}', [FileController::class, 'destroy']);
    Route::get('files', [FileController::class, 'index']);

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // Settings
    Route::get('settings', [SettingsController::class, 'index']);
    Route::put('settings', [SettingsController::class, 'update']);

    // AI Assistant
    Route::post('ai/query', [AiAssistantController::class, 'query']);
    Route::get('ai/conversations', [AiAssistantController::class, 'conversations']);
    Route::get('ai/conversations/{id}', [AiAssistantController::class, 'conversation']);
});
