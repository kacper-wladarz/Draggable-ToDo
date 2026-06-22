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
use Illuminate\Validation\Validator as ValidationValidator;

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
        "position" => "integer"
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

    public static function validateUpdate(array $data): array
    {
        return Validator::validate($data, [
            "title" => ["sometimes", "string", "max:255", "min:3"]
        ]);
    }

    public function validateChangePosition(array $data): array
    {


        $validator = Validator::make($data, [
            "column_id_from" => [
                "required",
                "integer",
                Rule::exists(modelValidationPrefix(Column::class), "id"),
                function ($attribute, $value, $fail) {
                    if ($this->column_id !== $value) {
                        $fail("The {$attribute} field does not match the current task column");
                    }
                }
            ],
            "column_id_to" => [
                "required",
                "integer",
                Rule::exists(modelValidationPrefix(Column::class), "id")
            ],
            "old_position_in_column" => [
                "required",
                "integer",
                function ($attribute, $value, $fail) {
                    if ($this->position !== $value) {
                        $fail("The {$attribute} field does not match the current task position in column");
                    }
                }
            ],
            "new_position_in_column" => [
                "required",
                "integer",
                "gte:0"
            ]
        ]);

        $validator->after(function (ValidationValidator $validator) use ($data) {
            $columnIdTo = $validator->getData()["column_id_to"];

            $tasksCountInColumn = Column::query()
                ->find($columnIdTo)
                ->tasks()
                ->where("workspace_uuid", "=", $this->workspace_uuid)
                ->count();

            if ($data["new_position_in_column"] > $tasksCountInColumn) {
                $validator
                    ->errors()
                    ->add("new_position_in_column", "Incorrect task position");
            }
        });

        return $validator->validate();
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
