<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use App\Services\Task\TaskServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends Controller implements HasMiddleware
{
    public function __construct(private TaskServiceInterface $taskService) {}

    public static function middleware()
    {
        return [
            new Middleware("can:isOwner,workspace", ["store"]),
        ];
    }

    public function store(Request $request, Workspace $workspace): JsonResponse
    {
        $data = $this->taskService->store($workspace, $request->all());

        return response()->json($data, Response::HTTP_CREATED);
    }
}
