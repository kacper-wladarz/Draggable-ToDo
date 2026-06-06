<?php

namespace App\Providers;

use App\Models\Workspace;
use App\Policies\WorkspacePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $singletonServices = require app_path("Providers/Interfaces/Singletons/services.php");
        $singletonRepositories = require app_path("Providers/Interfaces/Singletons/repositories.php");

        $this->singletons = array_merge($singletonServices, $singletonRepositories);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Workspace::class, WorkspacePolicy::class);
    }
}
