<?php

namespace App\Services\Workspace;

use App\Enums\OrderByEnum;
use App\Models\Workspace;
use App\Repositories\Column\ColumnRepositoryInterface;
use App\Repositories\Task\TaskRepositoryInterface;
use App\Repositories\Workspace\WorkspaceRepositoryInterface;
use Exception;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class WorkspaceService implements WorkspaceServiceInterface
{
    public function __construct(
        private WorkspaceRepositoryInterface $workspaceRepository,
        private ColumnRepositoryInterface $columnRepository,
        private TaskRepositoryInterface $taskRepository
    ) {}

    public function get(int $userId): Collection
    {
        return $this->workspaceRepository->getUserWorkspaces($userId, OrderByEnum::DESC);
    }

    public function store(array $data, int $userId): Workspace
    {
        $validated = Workspace::validateCreate($data, $userId);

        $validated["user_id"] = $userId;

        $workspace = $this->workspaceRepository->create($validated);

        $columns = $this->columnRepository->getAll();

        $workspace->columns()->attach(
            $columns->pluck("id")->mapWithKeys(fn(int $id) => [
                $id => ["visible" => true]
            ])->toArray()
        );

        return $workspace;
    }

    public function show(Workspace $workspace): array
    {
        $workspace->load(["columns" => function (BelongsToMany $query) use ($workspace) {
            $query
                ->withPivot(["visible"])
                ->with(["tasks" => function (HasMany $taskQuery) use ($workspace) {
                    $taskQuery->where("workspace_uuid", "=", $workspace->uuid);
                }])
                ->orderBy("columns.id");
        }]);

        $workspace->columns->each(function ($column) {
            $column->pivot->makeHidden(["workspace_uuid", "column_id"]);
        });

        return $workspace->toArray();
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

    public function update(Workspace $workspace, array $data, int $userId): Workspace
    {
        $validated = Workspace::validateUpdate($data, $userId);

        $workspace->update($validated);

        return $workspace;
    }

    public function getVisibleColumns(Workspace $workspace): Collection
    {
        return $this->workspaceRepository->getVisibleColumns($workspace);
    }

    public function toggleColumnVisibility(Workspace $workspace, array $data): void
    {
        $validated = Workspace::validateToggleColumnVisibility($data);

        $taskExists = $this->taskRepository->taskExists($workspace->uuid, $validated["column_id"]);

        if ($taskExists) {
            throw new Exception("To disable a column, it must not have any tasks assigned to it");
        }

        $workspace->columns()->updateExistingPivot($validated["column_id"], [
            "visible" => $validated["visible"]
        ]);
    }
}
