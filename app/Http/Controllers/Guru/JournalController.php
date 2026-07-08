<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index()
    {
        return Inertia::render('Guru/Journal/Index');
    }
}