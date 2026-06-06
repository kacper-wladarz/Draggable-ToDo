<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Auth\Access\Response;

class WorkspacePolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct() {}

    public function isOwner(User $user, Workspace $workspace): Response
    {
        return $workspace->user_id === $user->id ? Response::allow() : Response::deny('You do not own this workspace.');
    }
}
