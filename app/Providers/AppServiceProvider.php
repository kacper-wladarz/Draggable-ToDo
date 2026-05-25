<?php

namespace App\Providers;

use App\Repositories\Workspace\WorkspaceRepository;
use App\Repositories\Workspace\WorkspaceRepositoryInterface;
use Illuminate\Support\ServiceProvider;
use App\Repositories\User\UserRepository;
use App\Repositories\User\UserRepositoryInterface;
use App\Services\Workspace\WorkspaceService;
use App\Services\Workspace\WorkspaceServiceInterface;

class AppServiceProvider extends ServiceProvider
{
    private array $services = [
        WorkspaceServiceInterface::class =>  WorkspaceService::class
    ];

    private array $repositories = [
        UserRepositoryInterface::class => UserRepository::class,
        WorkspaceRepositoryInterface::class => WorkspaceRepository::class
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        foreach (array_merge($this->services, $this->repositories) as $interface => $class) {
            $this->app->singleton($interface, $class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
