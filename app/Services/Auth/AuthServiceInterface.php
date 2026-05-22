<?php

namespace App\Services\Auth;

interface AuthServiceInterface
{
    public function login(array $data): array;

    public function register(array $data): array;
}
