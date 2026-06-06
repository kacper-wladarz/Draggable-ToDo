<?php

namespace Database\Seeders;

use App\Models\Column;
use App\Models\Task;
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

        $workspaces = Workspace::factory(6)
            ->state(new Sequence(fn(Sequence $sequence) => ["name" => "Workspace " . $sequence->index + 1]))
            ->recycle(User::superuser())
            ->create();

        $columnIds = Column::query()->pluck("id")->toArray();

        $defaultPivotData = [];

        foreach ($columnIds as $columnId) {
            $defaultPivotData[$columnId] = ["visible" => true];
        }

        foreach ($workspaces as $workspace) {
            $workspace->columns()->syncWithoutDetaching($defaultPivotData);
        }

        Task::factory(500)
            ->recycle(Column::query()->get())
            ->recycle($workspaces)
            ->create();
    }
}
