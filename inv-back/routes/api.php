<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductTypeController;
use App\Http\Controllers\ItemController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    // Auth routes that require authentication
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('user', [AuthController::class, 'user']);
    // Product Types routes
    Route::apiResource('product-types', ProductTypeController::class);
    Route::apiResource('items', ItemController::class);

}); 