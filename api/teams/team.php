<?php
class Team
{
    private $connection;
    private $table = "teams";

    private $tid;
    private $name;

    public function __construct($db)
    {
        $this->connection = $db;
    }

    public function create()
    {

        /*
            Create new row in teams table
            parmas : None
            return : Boolean  
        */
        if (!empty($this->name)) {
            $query = "INSERT INTO " . $this->table . "(name) VALUES (:name)";

            $stmt = $this->connection->prepare($query);

            $this->name = htmlspecialchars(strip_tags($this->name));

            $stmt->bindParam(":name", $this->name);

            if ($stmt->execute()) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->tid = $row['tid'];
                return true;
            }
        }
        return false;
    }


    public function createTabelForTeam()
    {
    }

    public function addToTeam($tid, $pid)
    {
    }
}
