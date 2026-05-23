<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Override;

#[Fillable(["name", "user_id"])]
class Project extends Model
{
    use HasFactory;

    protected $table = "projects";

    protected $casts = [
        "name" => "string",
        "user_id" => "integer",
        "created_at" => "datetime:c",
        "updated_at" => "datetime:c"
    ];

    protected static function newFactory(): ProjectFactory
    {
        return ProjectFactory::new();
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
        ]);
    }
}
