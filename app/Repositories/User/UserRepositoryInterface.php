<?php

namespace App\Repositories\User;

use App\Models\User;

interface UserRepositoryInterface
{
    public function findByLogin(string $login): User;

    public function create(array $data): User;
}
