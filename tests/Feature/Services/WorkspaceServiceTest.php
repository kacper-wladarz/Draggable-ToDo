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
    public function getReturnsExpectedValue(): void
    {
        $user = User::factory()->createOne();

        Workspace::factory(10)->recycle($user)->create();

        $result = $this->workspaceService->get($user->id);

        $this->assertCount(10, $result);
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
            "uuid" => $result->uuid,
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

    #[Test]
    public function changePositionWorksWhenEndPositionIsHigher(): void
    {
        $user = User::superuser();

        for ($i = 0; $i < 10; $i++) {
            Workspace::factory()->recycle($user)->createOne(["position" => $i]);
        }

        $workspace = $user->workspaces()->where("position", "=", 0)->first();

        $randomHigherPosition = random_int(1, 9);

        $lowerWorkspaces = $user->workspaces
            ->where("position", "=<", $randomHigherPosition)
            ->where("position", "!=", 0);

        $this->workspaceService->changePosition(
            $workspace,
            [
                "position_from" => $workspace->position,
                "position_to" => $randomHigherPosition
            ],
            $user->id
        );

        $this->assertDatabaseHas(modelTableName($workspace::class), [
            "uuid" => $workspace->uuid,
            "position" => $randomHigherPosition
        ]);

        foreach ($lowerWorkspaces as $workspace) {
            $this->assertDatabaseHas(modelTableName($workspace::class), [
                "uuid" => $workspace->uuid,
                "position" => $workspace->position - 1
            ]);
        }
    }

    #[Test]
    public function changePositionWorksWhenEndPositionIsLower(): void
    {
        $user = User::superuser();

        for ($i = 0; $i < 10; $i++) {
            Workspace::factory()->recycle($user)->createOne(["position" => $i]);
        }

        $workspace = $user->workspaces()->where("position", "=", 9)->first();

        $randomHigherPosition = random_int(0, 8);

        $lowerWorkspaces = $user->workspaces
            ->where("position", ">=", $randomHigherPosition)
            ->where("position", "!=", 9);

        $this->workspaceService->changePosition(
            $workspace,
            [
                "position_from" => $workspace->position,
                "position_to" => $randomHigherPosition
            ],
            $user->id
        );

        $this->assertDatabaseHas(modelTableName($workspace::class), [
            "uuid" => $workspace->uuid,
            "position" => $randomHigherPosition
        ]);

        foreach ($lowerWorkspaces as $workspace) {
            $this->assertDatabaseHas(modelTableName($workspace::class), [
                "uuid" => $workspace->uuid,
                "position" => $workspace->position + 1
            ]);
        }
    }
}
