<?php

namespace App\Models;

use App\Repositories\Task\TaskRepositoryInterface;
use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

/**
 * @property int $id
 * @property string $title
 * @property string $workspace_uuid
 * @property int $column_id
 * 
 * @property Workspace $workspace
 * @property Column $column
 */
#[Fillable("title", "workspace_uuid", "column_id", "position")]
class Task extends Model
{
    use HasUuids, HasFactory;

    public $incrementing = false;
    public $timestamps = false;
    protected $table = "tasks";
    protected $primaryKey = "uuid";

    protected $casts = [
        "title" => "string",
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class, "workspace_uuid", "uuid");
    }

    public function column(): BelongsTo
    {
        return $this->belongsTo(Column::class, "column_id", "id");
    }

    public static function validateCreate(array $data): array
    {
        return Validator::validate($data, [
            "title" => ["required", "string", "max:255", "min:3"],
            "column_id" => ["required", "integer", Rule::exists(modelValidationPrefix(Column::class), "id")]
        ], [], [
            "column_id" => "column"
        ]);
    }

    protected static function boot()
    {
        parent::boot();

        self::creating(function (self $task) {
            $currentCountOfTasksInColumn = resolve(TaskRepositoryInterface::class)
                ->getCountOfTasksInSpecifiedColumnAndWorkspace($task->column_id, $task->workspace_uuid);

            $task->position = $currentCountOfTasksInColumn;
        });
    }

    protected static function newFactory(): TaskFactory
    {
        return TaskFactory::new();
    }
}
