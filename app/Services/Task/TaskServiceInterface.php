<?php

namespace App\Services\Task;

use App\Models\Task;
use App\Models\Workspace;

interface TaskServiceInterface
{
    public function store(Workspace $workspace, array $data): Task;
}
