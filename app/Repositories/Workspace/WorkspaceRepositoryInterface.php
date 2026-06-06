<?php

namespace App\Repositories\Workspace;

use App\Models\Workspace;
use App\Enums\OrderByEnum;
use Illuminate\Support\Collection;

interface WorkspaceRepositoryInterface
{
    public function getUserWorkspaces(int $userId, OrderByEnum $orderByPosition = OrderByEnum::ASC): Collection;

    public function create(array $data): Workspace;

    public function getCountOfUserWorkspaces(int $userId): int;

    public function getVisibleColumns(Workspace $workspace): Collection;
}
