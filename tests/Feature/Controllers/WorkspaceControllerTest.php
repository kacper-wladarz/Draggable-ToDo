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
}
