<?php

if (!function_exists("modelTableName")) {
    function modelTableName(string $classname)
    {
        return config("database.connections.mysql.database") . "." . (new $classname)->getTable();
    }
}
