<?php

namespace App\Http\Controllers;

use App\Models\ProductType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductTypeController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductType::where('user_id', Auth::id());
        
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        $productTypes = $query->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $productTypes
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = uniqid() . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/product-types'), $filename);
            $imagePath = 'images/product-types/' . $filename;
        }

        $productType = new ProductType([
            'name' => $request->name,
            'description' => $request->description,
            'image_path' => $imagePath,
            'count' => 0
        ]);
        $productType->user_id = Auth::id();
        $productType->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Product type created successfully',
            'data' => $productType
        ]);
    }

    public function show(ProductType $productType)
    {
        if ($productType->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $productType
        ]);
    }

    public function update(Request $request, ProductType $productType)
    {
        if ($productType->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($productType->image_path && file_exists(public_path($productType->image_path))) {
                unlink(public_path($productType->image_path));
            }
            
            $file = $request->file('image');
            $filename = uniqid() . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images/product-types'), $filename);
            $productType->image_path = 'images/product-types/' . $filename;
        }

        $productType->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Product type updated successfully',
            'data' => $productType
        ]);
    }

    public function destroy(ProductType $productType)
    {
        if ($productType->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete image if exists
        if ($productType->image_path && file_exists(public_path($productType->image_path))) {
            unlink(public_path($productType->image_path));
        }

        $productType->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product type deleted successfully'
        ]);
    }
} 