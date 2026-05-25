<?php

namespace Tests\Feature\Services;

use App\Models\Workspace;
use App\Models\User;
use App\Services\Workspace\WorkspaceServiceInterface;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Validation\ValidationException;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class WorkspaceServiceTest extends TestCase
{
    use DatabaseTransactions;

    private WorkspaceServiceInterface $workspaceService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->workspaceService = resolve(WorkspaceServiceInterface::class);
    }

    #[Test]
    public function itCreatesWorkspace(): void
    {
        $data = [
            "name" => "Workspace name"
        ];

        $user = User::factory()->createOne();

        $result = $this->workspaceService->store($data, $user->id);

        $this->assertInstanceOf(Workspace::class, $result);
        $this->assertEquals("Workspace name", $result->name);

        $this->assertDatabaseHas(modelTableName(Workspace::class), [
            "id" => $result->id,
            "name" => $data["name"],
            "user_id" => $user->id
        ]);
    }

    #[Test]
    public function whenWorkspaceNameExistsItDoNotCreateANewOne(): void
    {
        $user = User::factory()->createOne();

        $data = [
            "name" => "Workspace name"
        ];

        Workspace::factory()->recycle($user)->createOne(["name" => $data["name"]]);

        $this->expectException(ValidationException::class);
        $this->workspaceService->store($data, $user->id);
    }
}
