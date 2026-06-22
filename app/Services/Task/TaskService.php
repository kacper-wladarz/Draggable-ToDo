<?php

namespace App\Services\Task;

use App\Models\Column;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use App\Repositories\Column\ColumnRepositoryInterface;
use App\Repositories\Task\TaskRepositoryInterface;
use Exception;
use Illuminate\Database\Eloquent\Builder;

class TaskService implements TaskServiceInterface
{
    public function __construct(
        private TaskRepositoryInterface $taskRepository,
        private ColumnRepositoryInterface $columnRepository
    ) {}

    public function store(Workspace $workspace, array $data): Task
    {
        $validated = Task::validateCreate($data);

        if (!$this->columnRepository->isVisible($validated["column_id"], $workspace->uuid)) {
            throw new Exception("The column must be visible to assign task to it");
        }

        $validated["workspace_uuid"] = $workspace->uuid;

        return $this->taskRepository->create($validated);
    }

    public function update(Task $task, array $data): Task
    {
        $validated = Task::validateUpdate($data);

        $task->update($validated);

        return $task;
    }

    public function changePosition(Task $task, array $data, User $user): void
    {
        $validated = $task->validateChangePosition($data);

        $task->getConnection()->transaction(function () use ($task, $validated) {
            $newColumnId = $validated["column_id_to"];
            $newPositionInColumn = $validated["new_position_in_column"];

            if ($task->column_id === $newColumnId) {
                // the same column

                if ($newPositionInColumn === $task->position) return;

                $builder = $this->getTasksBuilder($task->workspace_uuid, $task->column_id);

                switch (true) {
                    case $newPositionInColumn > $task->position:
                        $builder
                            ->where("position", ">", $task->position)
                            ->where("position", "<=", $newPositionInColumn)
                            ->decrement("position", 1);
                        break;
                    case $newPositionInColumn < $task->position:
                        $builder
                            ->where("position", "<", $task->position)
                            ->where("position", ">=", $newPositionInColumn)
                            ->increment("position", 1);
                        break;
                    default:
                        return;
                }

                $task->update(["position" => $newPositionInColumn]);
            } else {
                // different column

                $this
                    ->getTasksBuilder($task->workspace_uuid, $task->column_id)
                    ->where("position", ">", $task->position)
                    ->decrement("position", 1);

                $this
                    ->getTasksBuilder($task->workspace_uuid, $newColumnId)
                    ->where("position", ">=", $newPositionInColumn)
                    ->increment("position", 1);

                $task->update([
                    "column_id" => $newColumnId,
                    "position" => $newPositionInColumn
                ]);
            }
        });
    }

    private function getTasksBuilder(string $workspaceUuid, int $columnId): Builder
    {
        return Task::query()
            ->where("workspace_uuid", "=", $workspaceUuid)
            ->where("column_id", "=", $columnId);
    }
}
