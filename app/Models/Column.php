<?php

namespace App\Models;

use Database\Factories\ColumnFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

/**
 * @property integer $id
 * @property string $name
 * 
 * @property Collection<Workspace> $workspaces
 */
#[Fillable("name")]
class Column extends Model
{
    use HasFactory;

    public $incrementing = true;
    public $timestamps = false;
    protected $table = "columns";
    protected $primaryKey = "id";

    protected $casts = [
        "name" => "string"
    ];

    protected static function newFactory(): ColumnFactory
    {
        return ColumnFactory::new();
    }

    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(
            Workspace::class,
            modelTableName(WorkspaceColumnAttachment::class),
            "column_id",
            "workspace_uuid"
        )->withPivot(["visible"]);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, "column_id", "id");
    }
}
