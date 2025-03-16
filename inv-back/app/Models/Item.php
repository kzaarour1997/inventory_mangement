<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Item extends Model
{
    protected $fillable = [
        'product_type_id',
        'serial_number',
        'is_sold'
    ];

    protected $casts = [
        'is_sold' => 'boolean'
    ];

    public function productType(): BelongsTo
    {
        return $this->belongsTo(ProductType::class);
    }
} 