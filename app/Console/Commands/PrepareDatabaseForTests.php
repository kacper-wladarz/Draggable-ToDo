<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

#[Signature('tests:database:fresh')]
#[Description('Prepares the database for testing')]
class PrepareDatabaseForTests extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (app()->environment() === "production") {
            $this->error("This command  should not be run in production.");
            return Command::FAILURE;
        }

        $schemaName = config("database.connections.mysql.database") . "_testing";

        Schema::dropDatabaseIfExists($schemaName);
        Schema::createDatabase($schemaName);

        config(["database.connections.mysql.database" => $schemaName]);

        DB::purge("mysql");

        $this->call("migrate:fresh", ["--env" => "testing"]);
        $this->call("optimize:clear");

        $this->info("The test database is prepared for use.");
    }
}
