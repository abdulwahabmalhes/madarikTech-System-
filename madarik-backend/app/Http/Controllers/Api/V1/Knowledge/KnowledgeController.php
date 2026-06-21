<?php

namespace App\Http\Controllers\Api\V1\Knowledge;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeArticle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KnowledgeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = KnowledgeArticle::where('tenant_id', $request->user()->tenant_id);
        
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('content', 'like', "%{$request->search}%");
            });
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'nullable|integer',
            'tags' => 'nullable|array',
            'is_published' => 'boolean',
        ]);
        
        $data['tenant_id'] = $request->user()->tenant_id;
        $data['created_by'] = $request->user()->id;
        
        return response()->json(KnowledgeArticle::create($data), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $record = KnowledgeArticle::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        return response()->json($record);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $record = KnowledgeArticle::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'category_id' => 'nullable|integer',
            'tags' => 'nullable|array',
            'is_published' => 'boolean',
        ]);

        $record->update($data);
        return response()->json($record);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $record = KnowledgeArticle::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $record->delete();
        return response()->json(['message' => 'تم الحذف بنجاح.']);
    }
}