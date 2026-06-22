<?php

use App\Models\WorkspaceColumnAttachment;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private string $indexName = "draggable_todo_wca_workspace_uuid_column_id";

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table(modelTableName(WorkspaceColumnAttachment::class), function (Blueprint $table) {
            $table->index(["workspace_uuid", "column_id"], $this->indexName);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('workspace_column_attachment', function (Blueprint $table) {
            if (Schema::hasIndex(modelTableName(WorkspaceColumnAttachment::class), $this->indexName)) {
                $table->dropIndex($this->indexName);
            }
        });
    }
};
