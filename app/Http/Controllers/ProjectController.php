<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Project\ProjectServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    public function __construct(private ProjectServiceInterface $projectService) {}

    public function store(Request $request)
    {
        return response()->json(
            $this->projectService
                ->store($request->all(), $request->user()->id),
            Response::HTTP_CREATED
        );
    }
}
