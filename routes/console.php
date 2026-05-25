<?php

use Illuminate\Support\Facades\Artisan;

/**
 * Prepares whole database for tests and run them
 */
Artisan::command("tests:run", function () {
    passthru("php artisan tests:database:fresh");
    passthru("php artisan test");
});
