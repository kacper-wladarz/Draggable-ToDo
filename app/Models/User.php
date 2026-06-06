<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 * @property string $name
 * @property string $login
 * @property string $password
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * 
 * @property Collection<Workspace> $workspaces
 */
#[Fillable(["name", "login", "password"])]
#[Hidden(["password"])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasApiTokens;

    public $incrementing = true;
    protected $table = "users";
    protected $primaryKey = "id";

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            "name" => "string",
            "login" => "string",
            "password" => "hashed",
            "created_at" => "datetime:c",
            "updated_at" => "datetime:c",
        ];
    }

    public static function superuser(): User
    {
        return self::query()->where("login", "=", "superuser")->first();
    }

    public static function validateLogin(array $data): array
    {
        return Validator::validate($data, [
            "login" => ["required", "string"],
            "password" => ["required", "string"],
        ]);
    }

    public static function validateRegistration(array $data): array
    {
        return Validator::validate($data, [
            "name" => ["required", "string", "max:255"],
            "login" => ["required", "string", Rule::unique(modelValidationPrefix(self::class)), "max:255"],
            "password" => ["required", "string", "min:8", "max:255", "confirmed"],
        ], [], ["name" => "nickname"]);
    }

    public function workspaces(): HasMany
    {
        return $this->hasMany(Workspace::class, "user_id", "id");
    }

    public function isSuperuser(): bool
    {
        return $this->login === "superuser";
    }
}
