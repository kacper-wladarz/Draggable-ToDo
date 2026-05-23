<?php

namespace App\Providers;

use App\Repositories\Project\ProjectRepository;
use App\Repositories\Project\ProjectRepositoryInterface;
use Illuminate\Support\ServiceProvider;
use App\Repositories\User\UserRepository;
use App\Repositories\User\UserRepositoryInterface;
use App\Services\Project\ProjectService;
use App\Services\Project\ProjectServiceInterface;

class AppServiceProvider extends ServiceProvider
{
    private array $services = [
        ProjectServiceInterface::class =>  ProjectService::class
    ];

    private array $repositories = [
        UserRepositoryInterface::class => UserRepository::class,
        ProjectRepositoryInterface::class => ProjectRepository::class
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
