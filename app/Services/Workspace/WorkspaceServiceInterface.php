<?php

namespace App\Services\Workspace;

use App\Models\Workspace;

interface WorkspaceServiceInterface
{
    public function store(array $data, int $userId): Workspace;
}
