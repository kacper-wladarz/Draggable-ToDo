<?php

use App\Models\Column;
use App\Models\Task;
use App\Models\Workspace;
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
        Schema::create(modelTableName(Task::class), function (Blueprint $table) {
            $table->uuid()->primary();
            $table->string("title", 255);
            $table->foreignUuid("workspace_uuid")
                ->constrained(modelTableName(Workspace::class), "uuid")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId("column_id")
                ->constrained(modelTableName(Column::class), "id")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(modelTableName(Task::class));
    }
};
