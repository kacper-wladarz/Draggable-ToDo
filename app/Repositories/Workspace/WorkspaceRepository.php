<?php

namespace App\Repositories\Workspace;

use App\Models\Workspace;
use App\Enums\OrderByEnum;
use Illuminate\Support\Collection;

class WorkspaceRepository implements WorkspaceRepositoryInterface
{
    public function getUserWorkspaces(int $userId, OrderByEnum $orderByPosition = OrderByEnum::ASC): Collection
    {
        return Workspace::query()
            ->where("user_id", "=", $userId)
            ->orderBy("position", $orderByPosition->value)
            ->get();
    }

    public function create(array $data): Workspace
    {
        return Workspace::query()->create($data);
    }

    public function getCountOfUserWorkspaces(int $userId): int
    {
        return $this->getUserWorkspaces($userId)->count();
    }
}
