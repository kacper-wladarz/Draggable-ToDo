<?php

if (!function_exists("modelTableName")) {
    function modelTableName(string $classname): string
    {
        return config("database.connections.mysql.database") . "." . (new $classname)->getTable();
    }
}

if (!function_exists("modelValidationPrefix")) {
    function modelValidationPrefix(string $classname): string
    {
        return config("database.default") . "." . modelTableName($classname);
    }
}
