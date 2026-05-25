<?php

namespace Tests\Feature\Services;

use App\Models\User;
use App\Services\Auth\AuthServiceInterface;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthServiceTest extends TestCase
{
    use DatabaseTransactions;

    private AuthServiceInterface $authService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authService = resolve(AuthServiceInterface::class);
    }

    #[Test]
    public function loginMethodGeneratesTokenForUser(): void
    {
        $this->freezeTime();

        User::factory()->createOne([
            "login" => "john123@example.com",
            "password" => Hash::make("password")
        ]);

        $result = $this->authService->login([
            "login" => "john123@example.com",
            "password" => "password"
        ]);

        $this->assertArrayHasKey("token", $result);
        $this->assertArrayHasKey("expires_at", $result);
        $this->assertEquals(now()->startOfSecond()->addSeconds(
            (int) config("auth.auth_token_ttl")
        ), $result["expires_at"]);
    }

    #[Test]
    public function registerMethodStoresUserAndGeneratesToken(): void
    {
        $this->freezeTime();

        $data = [
            "name" => "John",
            "login" => "john123@example.com",
            "password" => "password",
            "password_confirmation" => "password"
        ];

        $result = $this->authService->register($data);

        $this->assertArrayHasKey("token", $result);
        $this->assertArrayHasKey("expires_at", $result);
        $this->assertEquals(now()->startOfSecond()->addSeconds(
            (int) config("auth.auth_token_ttl")
        ), $result["expires_at"]);

        $user = User::query()->where("login", "=", $data["login"])->first();

        $tokens = PersonalAccessToken::query()->where("tokenable_id", "=", $user->id)->get();

        $this->assertCount(1, $tokens);

        $token = $tokens[0];

        $this->assertEquals(now()->startOfSecond()->addSeconds(
            (int) config("auth.auth_token_ttl")
        ), $token->expires_at);

        $this->assertDatabaseHas(modelTableName(User::class), [
            "id" => $token->tokenable->id,
            "name" => $data["name"],
            "login" => $data["login"],
        ]);
    }
}
