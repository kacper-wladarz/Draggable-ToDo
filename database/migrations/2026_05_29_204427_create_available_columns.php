<?php

use App\Models\Column;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $columns = ["Idea", "To Do", "In Progress", "Blocked", "To Review", "Testing", "Done"];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $data = array_map(
            fn(string $column) => ["name" => $column],
            $this->columns
        );

        DB::table(modelTableName(Column::class))->insert($data);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table(modelTableName(Column::class))
            ->whereIn("name", $this->columns)
            ->delete();
    }
};
