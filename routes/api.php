<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::name("api.")->group(function () {
    Route::prefix("auth")->name("auth.")->group(function () {
        Route::get("/me", [AuthController::class, "me"])->name("me")->middleware(["auth:sanctum"]);
        Route::post("/login", [AuthController::class, "login"])->name("login");
        Route::post("/registration", [AuthController::class, "registration"])->name("registration");
        Route::post("/logout", [AuthController::class, "logout"])->middleware("auth:sanctum")->name("logout");
    });

    Route::middleware("auth:sanctum")
        ->prefix("workspaces")
        ->name("workspaces.")
        ->group(function () {
            Route::post("/", [WorkspaceController::class, "store"])->name("store");
        });
});
