<?php

namespace App\Http\Controllers\Api\V1\Projects;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([]);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(['message' => 'تم الإنشاء.'], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return response()->json([]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        return response()->json(['message' => 'تم التحديث.']);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        return response()->json(['message' => 'تم الحذف.']);
    }
}
