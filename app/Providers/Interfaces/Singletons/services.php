<?php

use App\Services\Auth\AuthService;
use App\Services\Auth\AuthServiceInterface;
use App\Services\Task\TaskService;
use App\Services\Task\TaskServiceInterface;
use App\Services\Workspace\WorkspaceService;
use App\Services\Workspace\WorkspaceServiceInterface;

return [
    AuthServiceInterface::class => AuthService::class,
    WorkspaceServiceInterface::class => WorkspaceService::class,
    TaskServiceInterface::class => TaskService::class,
];
