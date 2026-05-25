<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use DatabaseTransactions;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::superuser();
    }

    #[Test]
    public function me(): void
    {
        $this->actingAs($this->user);

        $this->json("GET", route("api.auth.me"))
            ->assertJson(["user" => ["name" => "Superuser", "login" => "superuser"]])
            ->assertStatus(Response::HTTP_OK);
    }

    #[Test]
    public function itRegisterUser(): void
    {
        $this->json(
            "POST",
            route("api.auth.registration"),
            ["name" => "John", "login" => "john123@example.com", "password" => "password", "password_confirmation" => "password"]
        )
            ->assertJsonStructure(["token", "expires_at"]);

        $this->assertDatabaseHas(modelTableName(User::class), [
            "name" => "John",
            "login" => "john123@example.com",
        ]);

        $user = User::query()->where("login", "=", "john123@example.com")->first();

        $this->assertTrue(Hash::check("password", $user->password));
    }

    #[Test]
    public function itLoginUser(): void
    {
        $this->json(
            "POST",
            route("api.auth.registration"),
            ["name" => "John", "login" => "john123@example.com", "password" => "password", "password_confirmation" => "password"]
        )->assertJsonStructure(["token", "expires_at"]);
    }
}
