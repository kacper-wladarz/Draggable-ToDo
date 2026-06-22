<?php

namespace Tests\Feature\Repositories;

use App\Models\Column;
use App\Models\Task;
use App\Models\Workspace;
use App\Repositories\Task\TaskRepositoryInterface;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TaskRepositoryTest extends TestCase
{
    use DatabaseTransactions;

    private TaskRepositoryInterface $taskRepository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->taskRepository = resolve(TaskRepositoryInterface::class);
    }

    #[Test]
    public function createWorks(): void
    {
        $workspace = Workspace::factory()->createOne();
        $column = Column::factory()->createOne();

        $data = [
            "title" => "Task 1",
            "workspace_uuid" => $workspace->uuid,
            "column_id" => $column->id
        ];

        $result = $this->taskRepository->create($data);

        $this->assertDatabaseHas(modelTableName(Task::class), [
            "uuid" => $result->uuid,
            "title" => $data["title"],
            "workspace_uuid" => $data["workspace_uuid"],
            "column_id" => $data["column_id"]
        ]);
    }

    #[Test]
    public function getCountOfTasksInSpecifiedColumnAndWorkspaceWorks(): void
    {
        $column = Column::factory()->createOne();
        $workspace = Workspace::factory()->createOne();

        Task::factory(15)
            ->recycle($column)
            ->recycle($workspace)
            ->create();

        $this->assertEquals(15, $this->taskRepository->getCountOfTasksInSpecifiedColumnAndWorkspace($column->id, $workspace->uuid));
    }
}
