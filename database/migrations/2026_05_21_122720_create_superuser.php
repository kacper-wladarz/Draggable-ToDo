<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        User::query()->create([
            "name" => "Superuser",
            "login" => "superuser",
            "password" => Hash::make("password"),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        User::query()->where("login", "=", "superuser")->delete();
    }
};
