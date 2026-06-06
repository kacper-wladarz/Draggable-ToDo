<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::name("api.")->group(function () {
    Route::prefix("auth")->name("auth.")->group(function () {
        Route::get("/me", [AuthController::class, "me"])->name("me")->middleware(["auth:sanctum"]);
        Route::post("/login", [AuthController::class, "login"])->name("login");
        Route::post("/registration", [AuthController::class, "registration"])->name("registration");
        Route::post("/logout", [AuthController::class, "logout"])->middleware("auth:sanctum")->name("logout");
    });

    Route::middleware("auth:sanctum")->group(function () {
        /**
         * Workspaces
         */
        Route::prefix("workspaces")
            ->name("workspaces.")
            ->group(function () {
                Route::get("/", [WorkspaceController::class, "index"])->name("get");
                Route::post("/", [WorkspaceController::class, "store"])->name("store");
                Route::prefix("/{workspace}")
                    ->group(function () {
                        Route::get("/", [WorkspaceController::class, "show"])->name("show");
                        Route::patch("/position", [WorkspaceController::class, "changeWorkspacePosition"])->name("change-position");
                        Route::get("/visible-columns", [WorkspaceController::class, "getVisibleColumns"])->name("visible-columns");

                        /**
                         * Workspace's tasks
                         */
                        Route::prefix("tasks")
                            ->name("tasks.")->group(function () {
                                Route::post("/", [TaskController::class, "store"])->name("store");
                            });
                    });
            });
    });
});
