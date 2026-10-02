<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'order_code',
        'package_name',
        'amount',
        'status',
        'payment_method'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
