<?php

namespace App\Services\Auth;

use App\Models\User;
use App\Repositories\User\UserRepositoryInterface;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\NewAccessToken;

class AuthService implements AuthServiceInterface
{
    public function __construct(private UserRepositoryInterface $userRepository) {}

    private function generateToken(User $user): NewAccessToken
    {
        return $user->createToken("auth_token", ["*"], now()->addSeconds((int) config("auth.auth_token_ttl")));
    }

    public function login(array $data): array
    {
        $validated = User::validateLogin($data);

        try {
            $user = $this->userRepository->findByLogin($data["login"]);
        } catch (ModelNotFoundException $exception) {
            throw new Exception("Invalid credentials");
        }

        if (!Hash::check($validated["password"], $user->password)) {
            throw new Exception("Invalid credentials");
        }

        $user->tokens()->where("expires_at", "<", now())->delete();

        $token = $this->generateToken($user);

        return ["token" => $token->plainTextToken, "expires_at" => $token->accessToken->expires_at];
    }

    public function register(array $data): array
    {
        $validated = User::validateRegistration($data);

        $user = $this->userRepository->create($validated);

        $token = $this->generateToken($user);

        return ["token" => $token->plainTextToken, "expires_at" => $token->accessToken->expires_at];
    }
}
