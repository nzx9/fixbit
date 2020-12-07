<?php
class OpSupport
{
    private $connection;
    private $PU_SEARCH = "project_users_search_table";

    public function __construct($db)
    {
        $this->connection = $db;
    }

    public function addToProjectUserSearchSupport($uid, $pid, $isAdmin, $isPublic)
    {
        if (!empty($uid) && !empty($pid)) {
            $query = "INSERT INTO " . $this->PU_SEARCH . " (uid, pid, isAdmin, isPublic) 
                                               VALUES (:uid, :pid, :isAdmin, :isPublic)";

            $stmt = $this->connection->prepare($query);

            $uid = htmlspecialchars(strip_tags($uid));
            $pid = htmlspecialchars(strip_tags($pid));
            $isAdmin = htmlspecialchars(strip_tags($isAdmin));
            $isPublic = htmlspecialchars(strip_tags($isPublic));


            $stmt->bindParam(":uid", $uid);
            $stmt->bindParam(":pid", $pid);
            $stmt->bindParam(":isAdmin", $isAdmin);
            $stmt->bindParam(":isPublic", $isPublic);

            if ($stmt->execute() && $stmt->rowCount() > 0) {
                return true;
            }
        }
        return false;
    }

    public function getProjectsByUser($uid, $isPublic)
    {
        $query = "SELECT * FROM " .  $this->PU_SEARCH . " WHERE isPublic = :isPublic OR uid = :uid";
        $stmt = $this->connection->prepare($query);

        $uid = htmlspecialchars(strip_tags($uid));
        $isPublic = htmlspecialchars(strip_tags($isPublic));

        $stmt->bindParam(":uid", $uid);
        $stmt->bindParam(":isPublic", $isPublic);

        $stmt->execute();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = array(
                "pid" => $row['pid'],
            );
        }
        return $data;
    }
}
