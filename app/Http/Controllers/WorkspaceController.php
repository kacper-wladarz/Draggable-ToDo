<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Workspace\WorkspaceServiceInterface;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WorkspaceController extends Controller
{
    public function __construct(private WorkspaceServiceInterface $workspaceService) {}

    public function store(Request $request)
    {
        return response()->json(
            $this->workspaceService
                ->store($request->all(), $request->user()->id),
            Response::HTTP_CREATED
        );
    }
}
