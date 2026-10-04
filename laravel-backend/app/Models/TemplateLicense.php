<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemplateLicense extends Model
{
    protected $fillable = ['user_id', 'template_code', 'expires_at'];
    protected $casts = ['expires_at' => 'datetime'];
}
