<?php

namespace Tests\Feature\Controllers;

use App\Models\Workspace;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class WorkspaceControllerTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->actingAs($this->user = User::superuser());
    }

    #[Test]
    public function index(): void
    {
        $user = User::factory()->createOne();

        Workspace::factory(10)->recycle($user)->create();

        $this->actingAs($user);

        $this->json("GET", route("api.workspaces.get"))
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonCount(10);
    }

    #[Test]
    public function itStoresNewWorkspace(): void
    {
        $data = [
            "name" => "Workspace 1"
        ];

        $this->json("POST", route("api.workspaces.store"), $data)
            ->assertStatus(201)
            ->assertJson(["name" => $data["name"], "user_id" => $this->user->id]);

        $this->assertDatabaseHas(modelTableName(Workspace::class), [
            "name" => $data["name"],
            "user_id" => $this->user->id
        ]);
    }

    #[Test]
    public function whenWorkspaceNameExistsItCanNotCreateANewOne(): void
    {
        $data = [
            "name" => "Workspace 1"
        ];

        Workspace::factory()->recycle($this->user)->createOne(["name" => $data["name"]]);

        $this->json("POST", route("api.workspaces.store"), $data)->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    #[Test]
    public function show(): void
    {
        $user = User::factory()->createOne();

        $workspace = Workspace::factory()
            ->recycle($user)
            ->createOne(["name" => "Workspace 1"]);

        $this->actingAs($user);

        $this->json(
            "GET",
            route("api.workspaces.show", ["workspace" => $workspace])
        )
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                "uuid",
                "name",
                "user_id",
                "position",
            ])
            ->assertJsonFragment([
                "uuid" => $workspace->uuid,
                "name" => "Workspace 1",
                "user_id" => $user->id
            ]);
    }

    #[Test]
    public function changeWorkspacePositionToHigherPosition(): void
    {
        for ($i = 0; $i < 10; $i++) {
            Workspace::factory()->recycle($this->user)->createOne(["position" => $i]);
        }

        $workspace = $this->user->workspaces()->where("position", "=", 0)->first();

        $randomHigherPosition = random_int(1, 9);

        $this->json(
            "PATCH",
            route("api.workspaces.change-position", ["workspace" => $workspace]),
            ["position_from" => $workspace->position, "position_to" => $randomHigherPosition]
        )->assertStatus(Response::HTTP_NO_CONTENT);

        $this->assertDatabaseHas(modelTableName($workspace::class), [
            "uuid" => $workspace->uuid,
            "position" => $randomHigherPosition
        ]);
    }

    #[Test]
    public function changeWorkspacePositionToLowerPosition(): void
    {
        for ($i = 0; $i < 10; $i++) {
            Workspace::factory()->recycle($this->user)->createOne(["position" => $i]);
        }

        $workspace = $this->user->workspaces()->where("position", "=", 9)->first();

        $randomHigherPosition = random_int(0, 8);

        $this->json(
            "PATCH",
            route("api.workspaces.change-position", ["workspace" => $workspace]),
            ["position_from" => $workspace->position, "position_to" => $randomHigherPosition]
        )->assertStatus(Response::HTTP_NO_CONTENT);

        $this->assertDatabaseHas(modelTableName($workspace::class), [
            "uuid" => $workspace->uuid,
            "position" => $randomHigherPosition
        ]);
    }

    #[Test]
    public function changePositionThrowsErrorWhenPositionAreTheSame(): void
    {
        for ($i = 0; $i < 10; $i++) {
            Workspace::factory()->recycle($this->user)->createOne(["position" => $i]);
        }

        $workspace = $this->user->workspaces()->where("position", "=", 9)->first();

        $this->json(
            "PATCH",
            route("api.workspaces.change-position", ["workspace" => $workspace]),
            ["position_from" => 1, "position_to" => 1]
        )->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
