<?php

namespace Database\Seeders;

use App\Models\Workspace;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = User::factory(10)->create();

        foreach ($users as $user) {
            Workspace::withoutEvents(function () use ($user) {
                Workspace::factory(4)->recycle($user)->create();
            });
        }

        Workspace::factory(6)
            ->state(new Sequence(fn(Sequence $sequence) => ["name" => "Project " . $sequence->index + 1]))
            ->recycle(User::superuser())
            ->create();
    }
}
