<?php
class Member
{
    private $connection;
    private $table = "members";

    private $mid;
    private $role;
    public function __construct($db)
    {
        $this->connection = $db;
    }

    public function create($tid, $uid, $role)
    {
        if (
            !empty($tid) &&
            !empty($uid) &&
            !empty($role)
        ) {

            $query = "INSERT INTO " . $this->table . "(tid, uid, role) VALUES (:tid, :uid, :role)";

            $stmt = $this->connection->prepare($query);

            $tid = htmlspecialchars(strip_tags($this->tid));
            $uid = htmlspecialchars(strip_tags($this->uid));
            $role = htmlspecialchars(strip_tags($this->role));

            $stmt->bindParam(":tid", $this->tid);
            $stmt->bindParam(":uid", $this->uid);
            $stmt->bindParam(":role", $this->role);

            if ($stmt->execute()) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->mid = $row['mid'];
                return true;
            }

            return false;
        }
    }
}
