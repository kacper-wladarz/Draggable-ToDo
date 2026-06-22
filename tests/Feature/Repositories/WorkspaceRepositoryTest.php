<?php

namespace Tests\Feature\Repositories;

use App\Models\Workspace;
use App\Models\User;
use App\Repositories\Workspace\WorkspaceRepositoryInterface;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\App;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class WorkspaceRepositoryTest extends TestCase
{
    use DatabaseTransactions;

    private WorkspaceRepositoryInterface $workspaceRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->workspaceRepository = resolve(WorkspaceRepositoryInterface::class);
    }

    #[Test]
    public function getUserWorkspaces(): void
    {
        $user = User::factory()->createOne();

        Workspace::factory(10)->recycle($user)->create();

        $result = $this->workspaceRepository->getUserWorkspaces($user->id);

        $this->assertCount(10, $result);
    }

    #[Test]
    public function itCreatesNewWorkspace(): void
    {
        $user = User::factory()->createOne();

        $data = [
            "name" => "Workspace name",
            "user_id" => $user->id
        ];

        $result = $this->workspaceRepository->create($data);

        $this->assertInstanceOf(Workspace::class, $result);
        $this->assertEquals($data["name"], $result->name);
        $this->assertDatabaseHas(modelTableName(Workspace::class), [
            "uuid" => $result->uuid,
            "name" => $data["name"],
            "user_id" => $user->id
        ]);
    }
}
