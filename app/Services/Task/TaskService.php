<?php

namespace App\Services\Task;

use App\Models\Task;
use App\Models\Workspace;
use App\Repositories\Column\ColumnRepositoryInterface;
use App\Repositories\Task\TaskRepositoryInterface;
use Exception;

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
}
