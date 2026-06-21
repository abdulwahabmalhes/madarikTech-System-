<?php

namespace App\Http\Controllers\Api\V1\Products;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::where('tenant_id', $request->user()->tenant_id);
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('name_ar', 'like', "%{$request->search}%");
            });
        }
        if ($request->category) $query->where('category', $request->category);
        if ($request->has('is_active')) $query->where('is_active', $request->is_active);
        return response()->json($query->orderBy('name')->paginate($request->per_page ?? 50));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->all();
        $data['tenant_id'] = $request->user()->tenant_id;
        $data['created_by'] = $request->user()->id;
        return response()->json(Product::create($data), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $product = Product::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $product->update($request->all());
        return response()->json($product);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $product = Product::where('tenant_id', $request->user()->tenant_id)->findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'تم حذف المنتج.']);
    }
}