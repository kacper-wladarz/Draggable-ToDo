<?php

namespace App\Repositories\Column;

use App\Models\Column;
use App\Models\Workspace;
use Illuminate\Support\Collection;

class ColumnRepository implements ColumnRepositoryInterface
{
    public function getAll(): Collection
    {
        return Column::query()->get();
    }

    public function isVisible(Column|int $column, Workspace|string $workspace): bool
    {
        $column = $column instanceof Column ? $column : Column::query()->findOrFail($column);
        $workspaceUuid = $workspace instanceof Workspace ? $workspace->uuid : $workspace;

        if ($column->relationLoaded("workspaces")) {
            return (bool) $column->workspaces
                ->first(fn(Workspace $workspace) => $workspace->uuid === $workspaceUuid)?->pivot["visible"];
        }

        return $column->workspaces()
            ->withPivot(["visible"])
            ->where("workspace_uuid", "=", $workspaceUuid)
            ->where("visible", "=", true)
            ->exists();
    }
}
