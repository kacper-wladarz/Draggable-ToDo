<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Override;

#[Fillable(["name"])]
class Project extends Model
{
    use HasFactory;

    protected $table = "projects";

    protected $casts = [
        "name" => "string",
        "created_at" => "datetime:c",
        "updated_at" => "datetime:c"
    ];

    protected static function newFactory(): ProjectFactory
    {
        return ProjectFactory::new();
    }
}
