<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use App\Services\Workspace\WorkspaceServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WorkspaceController extends Controller
{
    public function __construct(private WorkspaceServiceInterface $workspaceService) {}

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

    public function show(Request $request, string $workspaceUuid): JsonResponse
    {
        return response()->json(Workspace::query()->find($workspaceUuid), Response::HTTP_OK);
    }

    public function changeWorkspacePosition(Request $request, Workspace $workspace): JsonResponse
    {
        $this->workspaceService->changePosition($workspace, $request->all(), $request->user()->id);

        return response()->json([], Response::HTTP_NO_CONTENT);
    }
}
