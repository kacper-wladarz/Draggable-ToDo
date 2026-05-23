<?php

namespace App\Services\Project;

use App\Models\Project;
use App\Repositories\Project\ProjectRepositoryInterface;

class ProjectService implements ProjectServiceInterface
{
    public function __construct(private ProjectRepositoryInterface $projectRepository) {}

    public function store(array $data, int $userId): Project
    {
        $validated = Project::validateCreate($data, $userId);

        $validated["user_id"] = $userId;

        return $this->projectRepository->create($validated);
    }
}
