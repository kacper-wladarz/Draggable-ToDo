<?php

namespace Database\Factories;

use App\Models\Column;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "title" => fake()->word(),
            "workspace_uuid" => Workspace::factory(),
            "column_id" => Column::factory()
        ];
    }
}
