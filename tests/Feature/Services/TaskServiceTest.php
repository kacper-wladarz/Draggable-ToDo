<?php

namespace Tests\Feature\Services;

use App\Models\Column;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use App\Services\Task\TaskServiceInterface;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class TaskServiceTest extends TestCase
{
    use DatabaseTransactions;

    private TaskServiceInterface $taskService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->taskService = resolve(TaskServiceInterface::class);
    }

    #[Test]
    public function storeWorks(): void
    {
        $user = User::factory()->createOne();
        $column = Column::factory()->createOne();
        $workspace = Workspace::factory()
            ->recycle($user)
            ->createOne();

        $column->workspaces()->attach($workspace->uuid, ["visible" => true]);

        $data = [
            "title" => "Task 1",
            "workspace_uuid" => $workspace->uuid,
            "column_id" => $column->id
        ];

        $this->actingAs($user);

        $result = $this->taskService->store($data);

        $this->assertDatabaseHas(modelTableName(Task::class), [
            "uuid" => $result->uuid,
            "title" => $data["title"],
            "workspace_uuid" => $workspace->uuid,
            "column_id" => $column->id,
            "position" => 0
        ]);
    }

    #[Test]
    public function storeThrowsExceptionWhenColumnIsNotVisible(): void
    {
        $user = User::factory()->createOne();
        $column = Column::factory()->createOne();
        $workspace = Workspace::factory()
            ->recycle($user)
            ->createOne();

        $column->workspaces()->attach($workspace->uuid, ["visible" => false]);

        $data = [
            "title" => "Task 1",
            "workspace_uuid" => $workspace->uuid,
            "column_id" => $column->id
        ];

        $this->actingAs($user);

        $this->expectExceptionMessage("The column must be visible to assign task to it");
        $this->taskService->store($data);
    }

    #[Test]
    public function storeThrowsExceptionWhenUserisNotOwnerOfTask(): void
    {
        $user1 = User::factory()->createOne();
        $column = Column::factory()->createOne();
        $workspace = Workspace::factory()
            ->recycle($user1)
            ->createOne();

        $data = [
            "title" => "Task 1",
            "workspace_uuid" => $workspace->uuid,
            "column_id" => $column->id
        ];

        $user2 = User::factory()->createOne();
        $this->actingAs($user2);

        $this->expectExceptionMessage("You do not own this workspace");
        $this->taskService->store($data);
    }
}
