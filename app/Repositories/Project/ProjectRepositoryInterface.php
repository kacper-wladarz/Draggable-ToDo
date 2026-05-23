<?php

namespace App\Repositories\Project;

use App\Models\Project;

interface ProjectRepositoryInterface
{
    public function create(array $data): Project;
}
