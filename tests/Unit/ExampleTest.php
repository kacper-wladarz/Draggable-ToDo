<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic test example.
     */
    public function test_that_true_is_true(): void
    {
        User::factory()->create(["name" => "test name"]);

        $this->assertDatabaseHas("users", ["name" => "test name"]);
    }
}
