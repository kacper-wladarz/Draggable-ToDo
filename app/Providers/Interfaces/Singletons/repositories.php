<?php

use App\Repositories\Column\ColumnRepository;
use App\Repositories\Column\ColumnRepositoryInterface;
use App\Repositories\Task\TaskRepository;
use App\Repositories\Task\TaskRepositoryInterface;
use App\Repositories\User\UserRepository;
use App\Repositories\User\UserRepositoryInterface;
use App\Repositories\Workspace\WorkspaceRepository;
use App\Repositories\Workspace\WorkspaceRepositoryInterface;

return [
    UserRepositoryInterface::class => UserRepository::class,
    WorkspaceRepositoryInterface::class => WorkspaceRepository::class,
    TaskRepositoryInterface::class => TaskRepository::class,
    ColumnRepositoryInterface::class => ColumnRepository::class
];
