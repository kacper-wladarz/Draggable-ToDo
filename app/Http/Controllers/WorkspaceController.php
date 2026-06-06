<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use App\Services\Workspace\WorkspaceServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Symfony\Component\HttpFoundation\Response;

class WorkspaceController extends Controller implements HasMiddleware
{
    public function __construct(private WorkspaceServiceInterface $workspaceService) {}

    public static function middleware()
    {
        return [
            new Middleware("can:isOwner,workspace", ["show", "changeWorkspacePosition", "getVisibleColumns"]),
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->workspaceService->get($request->user()->id);

        return response()->json($data, Response::HTTP_OK);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(
            $this->workspaceService
                ->store($request->all(), $request->user()->id),
            Response::HTTP_CREATED
        );
    }

    public function show(Request $request, Workspace $workspace): JsonResponse
    {
        return response()->json(
            $this->workspaceService->show($workspace),
            Response::HTTP_OK
        );
    }

    public function changeWorkspacePosition(Request $request, Workspace $workspace): JsonResponse
    {
        $this->workspaceService->changePosition($workspace, $request->all(), $request->user()->id);

        return response()->json([], Response::HTTP_NO_CONTENT);
    }

    public function getVisibleColumns(Request $request, Workspace $workspace)
    {
        return response()->json(
            $this->workspaceService->getVisibleColumns($workspace),
            Response::HTTP_OK
        );
    }
}
