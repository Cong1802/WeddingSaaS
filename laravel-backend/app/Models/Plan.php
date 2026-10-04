<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'subtitle',
        'price',
        'period',
        'description',
        'action',
        'features',
        'is_popular',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'float',
    ];
}
