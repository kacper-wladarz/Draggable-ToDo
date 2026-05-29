<?php

namespace App\Services\Workspace;

use App\Enums\OrderByEnum;
use App\Models\Workspace;
use App\Repositories\Workspace\WorkspaceRepositoryInterface;
use Illuminate\Support\Collection;

class WorkspaceService implements WorkspaceServiceInterface
{
    public function __construct(private WorkspaceRepositoryInterface $workspaceRepository) {}

    public function get(int $userId): Collection
    {
        return $this->workspaceRepository->getUserWorkspaces($userId, OrderByEnum::DESC);
    }

    public function store(array $data, int $userId): Workspace
    {
        $validated = Workspace::validateCreate($data, $userId);

        $validated["user_id"] = $userId;

        return $this->workspaceRepository->create($validated);
    }

    public function changePosition(Workspace $workspace, array $data, int $userId): void
    {
        $validated = Workspace::validateChangePosition($data, $userId, $workspace);

        $userWorkspaces = Workspace::query()
            ->where("user_id", "=", $userId)
            ->where("uuid", "!=", $workspace->uuid);

        $workspace->getConnection()->transaction(function () use ($workspace, $validated, $userWorkspaces) {
            $workspace->update(["position" => $validated["position_to"]]);

            if ($validated["position_from"] > $validated["position_to"]) {
                $userWorkspaces
                    ->where("position", ">=", $validated["position_to"])
                    ->where("position", "<=", $validated["position_from"])
                    ->increment("position", 1);
            } else {
                $userWorkspaces
                    ->where("position", ">=", $validated["position_from"])
                    ->where("position", "<=", $validated["position_to"])
                    ->decrement("position", 1);
            }
        });
    }
}
