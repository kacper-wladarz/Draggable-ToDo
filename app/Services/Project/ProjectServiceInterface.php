<?php

namespace App\Services\Project;

use App\Models\Project;

interface ProjectServiceInterface
{
    public function store(array $data, int $userId): Project;
}
