<?php

namespace Tests\Feature\Controllers;

use App\Models\Workspace;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
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
    public function itStoresNewWorkspacet(): void
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
    public function show()
    {
        $user = User::factory()->createOne();

        $workspace = Workspace::factory()
            ->recycle($user)
            ->createOne(["name" => "Workspace 1"]);

        $this->actingAs($user);

        $this->json(
            "GET",
            route("api.workspaces.show", ["workspaceUuid" => $workspace->uuid])
        )
            ->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                "uuid",
                "name",
                "user_id",
                "position",
                "created_at",
                "updated_at"
            ])
            ->assertJsonFragment([
                "uuid" => $workspace->uuid,
                "name" => "Workspace 1",
                "user_id" => $user->id
            ]);
    }
}
