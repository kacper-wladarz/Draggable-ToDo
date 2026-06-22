<?php

namespace Tests\Feature\Controllers;

use App\Models\Column;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use DatabaseTransactions;

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

        $result = $this->json("POST", route("api.workspaces.tasks.store", ["workspace" => $workspace->uuid]), $data)
            ->assertStatus(Response::HTTP_CREATED)
            ->json();

        $this->assertDatabaseHas(modelTableName(Task::class), [
            "uuid" => $result["uuid"],
            "title" => $data["title"],
            "workspace_uuid" => $workspace->uuid,
            "column_id" => $column->id,
            "position" => 0
        ]);
    }
}
