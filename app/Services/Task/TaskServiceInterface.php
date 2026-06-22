<?php

namespace App\Services\Task;

use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;

interface TaskServiceInterface
{
    public function store(Workspace $workspace, array $data): Task;

    public function update(Task $task, array $data): Task;

    public function changePosition(Task $task, array $data, User $user): void;
}
