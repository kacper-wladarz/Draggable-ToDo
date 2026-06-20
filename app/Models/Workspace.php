<?php

namespace App\Models;

use App\Policies\WorkspacePolicy;
use App\Repositories\Workspace\WorkspaceRepositoryInterface;
use Carbon\Carbon;
use Database\Factories\WorkspaceFactory;
use Exception;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

/**
 * @property int $id
 * @property string $name
 * @property int $user_id
 * @property int $position
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property User $user
 * @property Collection<Column> $columns
 */

#[Fillable(["name", "user_id", "position"])]
class Workspace extends Model
{
    use HasUuids, HasFactory;

    public $incrementing = false;
    public $timestamps = false;
    protected $table = "workspaces";
    protected $primaryKey = "uuid";

    protected $casts = [
        "name" => "string",
        "user_id" => "integer",
        "position" => "integer",
        "created_at" => "datetime:c",
        "updated_at" => "datetime:c"
    ];

    protected static function newFactory(): WorkspaceFactory
    {
        return WorkspaceFactory::new();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id", "id");
    }

    public function columns(): BelongsToMany
    {
        return $this->belongsToMany(
            Column::class,
            modelTableName(WorkspaceColumnAttachment::class),
            "workspace_uuid",
            "column_id"
        );
    }

    public static function validateCreate(array $data, int $userId): array
    {
        return Validator::validate($data, [
            "name" => [
                "required",
                "string",
                "max:255",
                Rule::unique(modelValidationPrefix(self::class))->where(
                    fn(Builder $query) => $query->where("user_id", "=", $userId)
                )
            ]
        ], [], ["name" => "workspace name"]);
    }

    public static function validateUpdate(array $data, int $userId): array
    {
        return Validator::validate($data, [
            "name" => [
                "required",
                "string",
                "max:255",
                Rule::unique(modelValidationPrefix(self::class))->where(
                    fn(Builder $query) => $query->where("user_id", "=", $userId)
                )
            ]
        ], [], ["name" => "workspace name"]);
    }

    public static function validateChangePosition(array $data, int $userId, Workspace $workspace): array
    {
        $workspacesCount = self::query()->where("user_id", "=", $userId)->count();

        return Validator::validate($data, [
            "position_from" => [
                "required",
                "integer",
                "between:0," . ($workspacesCount - 1),
                function ($attribute, $value, $fail) use ($workspace) {
                    if ($workspace->position !== $value) {
                        $fail("The position_from does not match the current workspace position");
                    }
                }
            ],
            "position_to" => [
                "required",
                "integer",
                "between:0," . ($workspacesCount - 1),
                "different:position_from"
            ]
        ]);
    }

    public static function validateToggleColumnVisibility(array $data): array
    {
        return Validator::validate($data, [
            "column_id" => ["required", "integer", Rule::exists(modelValidationPrefix(Column::class), "id")],
            "visible" => ["required", "boolean"]
        ]);
    }

    protected static function boot()
    {
        parent::boot();


        self::creating(function (self $workspace) {
            $count = resolve(WorkspaceRepositoryInterface::class)->getCountOfUserWorkspaces($workspace->user_id);

            if (!($count < 255)) {
                throw new Exception("The maximum number of workspaces has been reached");
            }

            $workspace->position = $count;
        });
    }
}
