<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Task;
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
            new Middleware("can:isOwner,workspace", [
                "store",
                "update",
                "destroy",
                "changePosition"
            ]),
        ];
    }

    public function store(Request $request, Workspace $workspace): JsonResponse
    {
        $data = $this->taskService->store($workspace, $request->all());

        return response()->json($data, Response::HTTP_CREATED);
    }

    public function update(Request $request, Workspace $workspace, Task $task): JsonResponse
    {
        return response()->json(
            $this->taskService->update($task, $request->all()),
            Response::HTTP_OK
        );
    }

    public function destroy(Request $request, Workspace $workspace, Task $task): JsonResponse
    {
        $task->delete();

        return response()->json([], Response::HTTP_NO_CONTENT);
    }

    public function changePosition(Request $request, Workspace $workspace, Task $task): JsonResponse
    {
        $this->taskService->changePosition($task, $request->all(), $request->user());

        return response()->json([], Response::HTTP_NO_CONTENT);
    }
}
