<?php

namespace Tests\Unit\Helpers;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HelpersTest extends TestCase
{
    use DatabaseTransactions;

    #[Test]
    public function modelTableNameReturnsExpectedValue(): void
    {
        $model = new User();

        $tableName = $model->getTable();
        $schemaName = config("database.connections.mysql.database");

        $this->assertEquals($schemaName . "." . $tableName, modelTableName(User::class));
    }

    #[Test]
    public function modelValidationPrefixReturnsExpectedValue(): void
    {
        $model = new User();

        $tableName = $model->getTable();
        $schemaName = config("database.connections.mysql.database");
        $connection = config("database.default");

        $this->assertEquals($connection . "." . $schemaName . "." . $tableName, modelValidationPrefix(User::class));
    }
}
