<?php

namespace App\Models;

use Database\Factories\WorkspaceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

#[Fillable(["name", "user_id"])]
class Workspace extends Model
{
    use HasUuids, HasFactory;

    protected $table = "workspaces";
    protected $primaryKey = "uuid";
    public $incrementing = false;

    protected $casts = [
        "name" => "string",
        "user_id" => "integer",
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

    public static function validateCreate(array $data, int $userId)
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
}
