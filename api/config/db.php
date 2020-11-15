<?php

class Database
{
    private $host = "127.0.0.1";
    private $dbname = "test_db";
    private $user = "root";
    private $passwd = "navi2017AL";

    public $connection;

    public function connect()
    {
        $this->connection = null;

        try {
            $this->connection = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->dbname, $this->user, $this->passwd);
        } catch (PDOException $e) {
            echo "Error(Connection):: " . $e->getMessage();
        }
        return $this->connection;
    }
}
