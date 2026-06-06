<?php

use App\Models\Column;
use App\Models\Workspace;
use App\Models\WorkspaceColumnAttachment;
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
        Schema::create(modelTableName(WorkspaceColumnAttachment::class), function (Blueprint $table) {
            $table->id();
            $table->foreignUuid("workspace_uuid")
                ->constrained(modelTableName(Workspace::class), "uuid", "draggable_todo_wca_to_workspaces")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->foreignId("column_id")
                ->constrained(modelTableName(Column::class), "id", "draggable_todo_wca_to_columns")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->boolean("visible")->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists(modelTableName(WorkspaceColumnAttachment::class));
    }
};
