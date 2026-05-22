<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Auth\AuthService;
use App\Services\Auth\AuthServiceInterface;

class AuthServiceProvider extends ServiceProvider
{
    public array $singletons = [
        AuthServiceInterface::class => AuthService::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
