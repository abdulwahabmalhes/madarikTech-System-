<?php

namespace App\Http\Controllers\Api\V1\Clients;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientTrackingController extends Controller
{
    /**
     * Public endpoint to track client projects using name and client_code.
     */
    public function track(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string',
            'client_code' => 'required|string',
        ]);

        $client = Client::where('client_code', $request->client_code)->first();

        // Very simple matching for the name (case-insensitive, basic match)
        if (!$client || strtolower(trim($client->name)) !== strtolower(trim($request->name))) {
            return response()->json([
                'message' => 'بيانات الدخول غير صحيحة. يرجى التأكد من اسم العميل والكود الخاص به.'
            ], 401);
        }

        // Load necessary tracking data (Projects, Invoices, Quotations, Contracts, Reports)
        $client->load([
            'projects' => function ($q) {
                $q->select('id', 'client_id', 'name', 'status', 'progress_percent', 'expected_end_date', 'description')
                  ->with([
                      'milestones:id,project_id,title,status,due_date',
                      'tasks' => function ($t) {
                          $t->select('id', 'project_id', 'title', 'status', 'due_date', 'priority')->orderBy('due_date');
                      }
                  ])
                  ->orderByDesc('created_at');
            },
            'invoices' => function ($q) {
                $q->select('id', 'client_id', 'invoice_number', 'total', 'status', 'due_date', 'remaining_amount')
                  ->orderByDesc('issue_date');
            },
            'quotations' => function ($q) {
                $q->select('id', 'client_id', 'quotation_number', 'project_name', 'total', 'status')
                  ->orderByDesc('created_at');
            },
            'contracts' => function ($q) {
                $q->select('id', 'client_id', 'title', 'contract_number', 'status', 'value', 'start_date', 'end_date')
                  ->orderByDesc('created_at');
            },
            'dailyReports' => function ($q) {
                $q->select('id', 'client_id', 'report_date', 'title', 'work_completed', 'status')
                  ->orderByDesc('report_date');
            }
        ]);

        // To make it stateless, we just return the full client data dashboard directly
        // The frontend can store this in memory for the tracking session
        return response()->json([
            'message' => 'تم الدخول بنجاح',
            'client' => $client
        ]);
    }
}
