<?php

namespace App\Services\Workspace;

use App\Models\Workspace;
use App\Repositories\Workspace\WorkspaceRepositoryInterface;

class WorkspaceService implements WorkspaceServiceInterface
{
    public function __construct(private WorkspaceRepositoryInterface $workspaceRepository) {}

    public function store(array $data, int $userId): Workspace
    {
        $validated = Workspace::validateCreate($data, $userId);

        $validated["user_id"] = $userId;

        return $this->workspaceRepository->create($validated);
    }
}
