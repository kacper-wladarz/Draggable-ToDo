<?php

namespace App\Repositories\Column;

use App\Models\Column;
use App\Models\Workspace;
use Illuminate\Support\Collection;

interface ColumnRepositoryInterface
{
    public function isVisible(Column|int $column, Workspace|string $workspace): bool;
}
