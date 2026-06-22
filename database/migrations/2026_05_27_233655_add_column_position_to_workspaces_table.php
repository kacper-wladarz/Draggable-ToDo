<?php

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
        Schema::table(modelTableName(Workspace::class), function (Blueprint $table) {
            $table->unsignedTinyInteger("position");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('workspaces', function (Blueprint $table) {
            if (Schema::hasColumn(modelTableName(Workspace::class), "position")) {
                $table->dropColumn("position");
            }
        });
    }
};
