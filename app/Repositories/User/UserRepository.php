<?php

namespace App\Repositories\User;

use App\Models\User;
use Override;

class UserRepository implements UserRepositoryInterface
{
    public function findByLogin(string $login): User
    {
        return User::query()->where("login", "=", $login)->firstOrFail();
    }

    #[Override]
    public function create(array $data): User
    {
        return User::query()->create($data);
    }
}
