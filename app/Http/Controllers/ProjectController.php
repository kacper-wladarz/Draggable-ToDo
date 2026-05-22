<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    public function __construct() {}

    public function create(Request $request)
    {
        return response()->json([], Response::HTTP_CREATED);
    }
}
