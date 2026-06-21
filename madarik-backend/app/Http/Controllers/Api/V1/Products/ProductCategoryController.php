<?php

namespace App\Http\Controllers\Api\V1\Products;

use App\Http\Controllers\Controller;
use App\Models\ProductCategory;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = ProductCategory::where('tenant_id', $request->user()->tenant_id)->get();
        return response()->json(['data' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'name_ar' => 'required|string|max:255',
            'badge_color' => 'nullable|string|max:50',
        ]);

        $validated['tenant_id'] = $request->user()->tenant_id;
        if (empty($validated['badge_color'])) {
            $validated['badge_color'] = 'badge-gray';
        }

        $category = ProductCategory::create($validated);

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }
}
