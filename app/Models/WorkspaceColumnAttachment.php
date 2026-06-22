<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

/**
 * @property int $id
 * @property string $workspace_uuid
 * @property int $column_id
 * @property bool $visible
 * 
 * @property Collection<Task> $tasks
 */
#[Fillable("workspace_uuid", "column_id", "visible")]
class WorkspaceColumnAttachment extends Model
{
    public $timestamps = false;
    protected $table = "workspace_column_attachemnt";

    protected $casts = [
        "workspace_uuid" => "string",
        "column_id" => "integer",
        "visible" => "boolean"
    ];

    public function todos(): HasMany
    {
        return $this->hasMany(Task::class, "workspace_column_attachment_id", "id");
    }
}
