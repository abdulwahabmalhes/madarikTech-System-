<?php

namespace App\Http\Controllers\Api\V1\Meetings;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Meeting::where('tenant_id', $request->user()->tenant_id)
            ->with(['client:id,name,company_name', 'createdUser:id,name']);
        if ($request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }
        if ($request->status) $query->where('status', $request->status);
        return response()->json($query->orderByDesc('date')->paginate($request->per_page ?? 30));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['tenant_id'] = $request->user()->tenant_id;
        $data['created_by'] = $request->user()->id;
        
        // Generate meeting_number if not provided
        if (empty($data['meeting_number'])) {
            $data['meeting_number'] = 'MTG-' . strtoupper(uniqid());
        }

        if (isset($data['external_attendees']) && !is_array($data['external_attendees'])) {
            $data['external_attendees'] = $data['external_attendees'] ? array_map('trim', explode(',', $data['external_attendees'])) : null;
        }

        return response()->json(Meeting::create($data), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $m = Meeting::where('tenant_id', $request->user()->tenant_id)
            ->with(['client', 'lead', 'project', 'createdUser:id,name'])
            ->findOrFail($id);
        return response()->json($m);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $m = Meeting::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        
        $data = $request->all();
        if (isset($data['external_attendees']) && !is_array($data['external_attendees'])) {
            $data['external_attendees'] = $data['external_attendees'] ? array_map('trim', explode(',', $data['external_attendees'])) : null;
        }

        $m->update($data);
        return response()->json($m);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $m = Meeting::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $m->delete();
        return response()->json(['message' => 'تم حذف الاجتماع.']);
    }

    public function complete(Request $request, int $id): JsonResponse
    {
        $m = Meeting::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $m->update([
            'status'  => 'done',
            'minutes' => $request->minutes,
            'outcome' => $request->outcome,
        ]);
        return response()->json(['message' => 'تم تسجيل إتمام الاجتماع.']);
    }
}