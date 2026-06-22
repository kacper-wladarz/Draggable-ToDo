<?php

use App\Models\Workspace;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create(modelTableName(Workspace::class), function (Blueprint $table) {
            $table->uuid()->primary();
            $table->string("name", 255);
            $table->foreignId("user_id")->constrained(modelTableName(User::class), "id")->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(modelTableName(Workspace::class));
    }
};
