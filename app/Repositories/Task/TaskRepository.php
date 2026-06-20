<?php

namespace App\Repositories\Task;

use App\Models\Task;
use Illuminate\Contracts\Database\Query\Builder;

class TaskRepository implements TaskRepositoryInterface
{
    public function create(array $data): Task
    {
        return Task::query()->create($data);
    }

    public function getCountOfTasksInSpecifiedColumnAndWorkspace(int $columnId, string $workspaceUuid): int
    {
        return Task::query()->where(function (Builder $query) use ($columnId, $workspaceUuid) {
            $query
                ->where("column_id", "=", $columnId)
                ->where("workspace_uuid", "=", $workspaceUuid);
        })->count();
    }

    public function taskExists(string $workspaceUuid, int $columnId): bool
    {
        return Task::query()->where(function (Builder $query) use ($workspaceUuid, $columnId) {
            $query
                ->where("workspace_uuid", "=", $workspaceUuid)
                ->where("column_id", "=", $columnId);
        })->exists();
    }
}
