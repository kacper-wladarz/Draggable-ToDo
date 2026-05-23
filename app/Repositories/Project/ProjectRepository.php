<?php

namespace App\Repositories\Project;

use App\Models\Project;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function create(array $data): Project
    {
        return Project::query()->create($data);
    }
}
