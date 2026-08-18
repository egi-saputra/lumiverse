<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiGeneration extends Model
{
    use HasFactory;

    protected $table = 'ai_generations';

    protected $fillable = [
        'user_id',
        'plan_key',
        'source',
        'status',
        'cost',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}