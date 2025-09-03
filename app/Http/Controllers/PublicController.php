<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Display the public landing page.
     */
    public function index()
    {
        return Inertia::render('welcome');
    }
}