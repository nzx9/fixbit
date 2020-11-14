<?php

class Project
{
    private $connection;
    private $table = "projects";

    private $pid;
    private $name;
    private $description;
    private $creatorId;
    private $adminId;
    private $teamId;

    public function __construct($db)
    {
        $this->connection = $db;
    }
    public function getId()
    {
        return $this->pid;
    }
    public function getName()
    {
        return $this->name;
    }
    public function getCreatorId()
    {
        return $this->creatorId;
    }
    public function getAdminId()
    {
        return $this->adminId;
    }
    public function getTeamId()
    {
        return $this->teamId;
    }

    // public function getCreatorInfo($creatorId)
    // {
    //     if (!empty($creatorId)) {
    //         $query = "SELECT uid, firstname, lastname, email FROM users WHERE uid = ? LIMIT 0,1";
    //         $stmt = $this->connection->prepare($query);
    //         $creatorId = htmlspecialchars(strip_tags($creatorId));
    //         $stmt->bindParam(1, $creatorId);
    //         $stmt->execute();

    //         if ($stmt->rowCount() == 1) {
    //             $row = $stmt->fetch(PDO::FETCH_ASSOC);
    //             $uid = $row['uid'];
    //             $firstname = $row['firstname'];
    //             $lastname = $row['lastname'];
    //             $email = $row['email'];
    //             $user_data = array(
    //                 "uid" => $uid,
    //                 "firstname" => $firstname,
    //                 "lastname" => $lastname,
    //                 "email" => $email
    //             );
    //             return $user_data;
    //         }
    //     }
    // }

    // public function getAdminInfo($adminId)
    // {
    //     if (!empty($adminId)) {
    //         $query = "SELECT uid, firstname, lastname, email FROM users WHERE uid = ? LIMIT 0,1";
    //         $stmt = $this->connection->prepare($query);
    //         $adminId = htmlspecialchars(strip_tags($adminId));
    //         $stmt->bindParam(1, $adminId);
    //         $stmt->execute();

    //         if ($stmt->rowCount() == 1) {
    //             $row = $stmt->fetch(PDO::FETCH_ASSOC);
    //             $uid = $row['uid'];
    //             $firstname = $row['firstname'];
    //             $lastname = $row['lastname'];
    //             $email = $row['email'];
    //             $user_data = array(
    //                 "uid" => $uid,
    //                 "firstname" => $firstname,
    //                 "lastname" => $lastname,
    //                 "email" => $email
    //             );
    //             return $user_data;
    //         }
    //     }
    // }

    // public function getTeamInfo($teamId)
    // {
    //     if (!empty($teamId)) {
    //         $query = "SELECT tid, uid, role, date_added FROM teams WHERE tid = ?";
    //         $stmt = $this->connection->prepare($query);
    //         $adminId = htmlspecialchars(strip_tags($teamId));
    //         $stmt->bindParam(1, $teamId);
    //         $stmt->execute();

    //         if ($stmt->rowCount() == 1) {  // fix for multiple
    //             $row = $stmt->fetch(PDO::FETCH_ASSOC);
    //             $tid = $row['tid'];
    //             $uid = $row['uid'];
    //             $role = $row['role'];
    //             $date_added = $row['date_added'];
    //             $data = array(
    //                 "tid" => $tid,
    //                 "uid" => $uid,
    //                 "role" => $role,
    //                 "date_added" => $date_added
    //             );
    //             return $data;
    //         }
    //     }
    // }

    public function create()
    {
        if (!empty($this->name) && !empty($this->description)) {
            $query = "INSERT INTO " . $this->table . "(name, description, creator_id, admin_id) VALUES (:name, :description, :creator_id, :creator_id)";

            $stmt = $this->connection->prepare($query);

            $this->name = htmlspecialchars(strip_tags($this->name));
            $this->description = htmlspecialchars(strip_tags($this->description));
            $this->creatorId = htmlspecialchars(strip_tags($this->creatorId));


            $stmt->bindParam(":name", $this->name);
            $stmt->bindParam(":description", $this->description);
            $stmt->bindParam(":creator_id", $this->creatorId);

            if ($stmt->execute()) {
                return true;
            }
        }
        return false;
    }

    public function getProjectById($pid)
    {
        if (!empty($pid)) {
            $query = "SELECT * FROM " . $this->table . " WHERE pid = ?";
            $stmt = $this->connection->prepare($query);
            $pid = htmlspecialchars(strip_tags($pid));
            $stmt->bindParam(1, $pid);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->pid = $row['pid'];
                $this->name = $row['name'];
                $this->creatorId = $row['creator_id'];
                $this->adminId = $row['admin_id'];
                $this->teamId = $row['team_id'];
                return true;
            }
        }
        return false;
    }
}
