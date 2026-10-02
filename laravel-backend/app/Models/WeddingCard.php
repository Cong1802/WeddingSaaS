<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeddingCard extends Model
{
    use HasFactory;

    protected $table = 'wedding_cards';

    protected $fillable = [
        'user_id',
        'slug',
        'template_id',
        'card_data',
        'is_published',
        'views_count'
    ];

    protected $casts = [
        'card_data' => 'array',
        'is_published' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
