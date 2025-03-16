<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ProductType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $productType = ProductType::where('id', $request->product_type_id)->first();
        if (!$productType) {
            return response()->json(['message' => 'Product type not found'], 404);
        }
        if ($productType->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = $productType->items();

        if ($request->has('search')) {
            $query->where('serial_number', 'like', '%' . $request->search . '%');
        }

        $items = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $items
        ]);
    }

    public function store(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'serial_numbers' => 'required|array',
            'serial_numbers.*' => 'required|string|unique:items,serial_number',
            "product_type_id" => "required|exists:product_types,id"
        ]);

        $productType = ProductType::where('id', $request->product_type_id)->first();
        if (!$productType) {
            return response()->json(['message' => 'Product type not found'], 404);
        }
        if ($productType->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $items = [];
        foreach ($request->serial_numbers as $serialNumber) {
            $items[] = $productType->items()->create([
                'serial_number' => $serialNumber,
                'is_sold' => false,
                'product_type_id' => $request->product_type_id
            ]);
        }

        // Update product type count
        $productType->increment('count', count($items));

        return response()->json([
            'status' => 'success',
            'message' => 'Items added successfully',
            'data' => $items
        ]);
    }

    public function update(Request $request, Item $item)
    {


        $validator = Validator::make($request->all(), [
            'is_sold' => 'required|boolean',
            "product_type_id" => "required|exists:product_types,id"
        ]);
        $productType = ProductType::where('id', $item->product_type_id)->first();
        if (!$productType) {
            return response()->json(['message' => 'Product type not found'], 404);
        }
        if ($productType->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $oldSoldStatus = $item->is_sold;
        $item->update([
            'is_sold' => $request->is_sold
        ]);

        // Update product type count if sold status changed
        if ($oldSoldStatus !== $request->is_sold) {
            if ($request->is_sold) {
                $productType->decrement('count');
            } else {
                $productType->increment('count');
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Item updated successfully',
            'data' => $item
        ]);
    }

    public function destroy(Item $item)
    {
        $productType = ProductType::where('id', $item->product_type_id)->first();
        if (!$productType) {
            return response()->json(['message' => 'Product type not found'], 404);
        }
        if ($productType->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // If item is not sold, decrement the product type count
        if (!$item->is_sold) {
            $productType->decrement('count');
        }

        $item->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Item deleted successfully'
        ]);
    }
}
