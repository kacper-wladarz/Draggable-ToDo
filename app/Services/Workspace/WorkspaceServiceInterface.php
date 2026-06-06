<?php

namespace App\Services\Workspace;

use App\Models\Workspace;
use Illuminate\Support\Collection;

interface WorkspaceServiceInterface
{
    public function get(int $userId): Collection;

    public function store(array $data, int $userId): Workspace;

    public function show(Workspace $workspace): array;

    public function changePosition(Workspace $workspace, array $data, int $userId): void;

    public function getVisibleColumns(Workspace $workspace): Collection;
}
