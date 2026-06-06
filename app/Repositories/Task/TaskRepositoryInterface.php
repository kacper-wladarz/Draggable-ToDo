<?php

namespace App\Repositories\Task;

use App\Models\Task;

interface TaskRepositoryInterface
{
    public function create(array $data): Task;

    public function getCountOfTasksInSpecifiedColumnAndWorkspace(int $columnId, string $workspaceUuid): int;
}
