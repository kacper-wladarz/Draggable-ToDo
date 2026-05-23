<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Carbon\Carbon;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property int $id
 * @property string $name
 * @property string $login
 * @property string $password
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */

#[Fillable(["name", "login", "password"])]
#[Hidden(["password"])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasApiTokens;

    protected $table = "users";

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
            "login" => ["required", "string", "unique:users,login", "max:255"],
            "password" => ["required", "string", "min:8", "max:255", "confirmed"],
        ], [], ["name" => "nickname"]);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, "user_id", "id");
    }
}
