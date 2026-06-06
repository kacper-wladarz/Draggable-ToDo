<?php

namespace Tests\Feature\Repositories;

use App\Models\Column;
use App\Models\Workspace;
use App\Repositories\Column\ColumnRepositoryInterface;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ColumnRepositoryTest extends TestCase
{
    use DatabaseTransactions;

    private ColumnRepositoryInterface $columnRepository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->columnRepository = resolve(ColumnRepositoryInterface::class);
    }

    #[Test]
    public function isVisibleHasLoadedWorkspacesRelation(): void
    {
        $column = Column::factory()->createOne();
        $workspace = Workspace::factory()->createOne();

        $column->workspaces()->attach($workspace->uuid, ["visible" => true]);

        $column->load("workspaces");

        $this->assertTrue($this->columnRepository->isVisible($column, $workspace));
    }

    #[Test]
    public function isVisibleDoNotHaveLoadedWorkspacesRelation(): void
    {
        $column = Column::factory()->createOne();
        $workspace = Workspace::factory()->createOne();

        $column->workspaces()->attach($workspace->uuid, ["visible" => true]);

        $this->assertTrue($this->columnRepository->isVisible($column, $workspace));
    }
}
