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
    private $isPublic;
    private $dateCreated;

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
    public function getDescription()
    {
        return $this->description;
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
    public function getIsPublic()
    {
        return $this->isPublic;
    }
    public function getDateCreated()
    {
        return $this->dateCreated;
    }
    public function setName($name)
    {
        $this->name = $name;
    }
    public function setDescription($description)
    {
        $this->description = $description;
    }
    public function setCreatorId($creatorId)
    {
        $this->creatorId = $creatorId;
    }
    public function setAdminId($adminId)
    {
        $this->adminId = $adminId;
    }
    public function setTeamId($teamId)
    {
        $this->teamId = $teamId;
    }
    public function setIsPublic($isPublic)
    {
        $this->isPublic = $isPublic;
    }
    public function projectNameOk($name)
    {
        if (!empty($name)) {
            $query = "SELECT pid FROM " . $this->table . " WHERE name = ? LIMIT 0,1";
            $stmt = $this->connection->prepare($query);

            $name = htmlspecialchars(strip_tags($name));
            $stmt->bindParam(1, $name);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                return false;
            }
            return true;
        }
    }

    public function create()
    {
        if (!empty($this->name) && !empty($this->description)) {
            $query = "INSERT INTO " . $this->table . "(name, description, creator_id, admin_id, isPublic) 
                                               VALUES (:name, :description, :creator_id, :creator_id, :isPublic)";

            $stmt = $this->connection->prepare($query);

            $this->name = htmlspecialchars(strip_tags($this->name));
            $this->description = htmlspecialchars(strip_tags($this->description));
            $this->creatorId = htmlspecialchars(strip_tags($this->creatorId));
            $this->isPublic = htmlspecialchars(strip_tags($this->isPublic));

            $stmt->bindParam(":name", $this->name);
            $stmt->bindParam(":description", $this->description);
            $stmt->bindParam(":creator_id", $this->creatorId);
            $stmt->bindParam(":isPublic", $this->isPublic);

            if ($stmt->execute() && $stmt->rowCount() > 0) {
                return true;
            }
        }
        return false;
    }

    public function createTableForProject($pid)
    {
        if (!empty($pid)) {
            try {
                $query = "CREATE TABLE " . "project_" . $pid .
                    "( iid INT NOT NULL AUTO_INCREMENT , 
                    title VARCHAR(50) NOT NULL , 
                    description VARCHAR(500) NOT NULL , 
                    attachments JSON NULL , 
                    createdBy INT NOT NULL , 
                    assignedTo INT NULL , 
                    priority TINYINT NOT NULL , 
                    type TINYINT NOT NULL , 
                    isOpen TINYINT NOT NULL , 
                    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
                    comments JSON NULL ,
                    PRIMARY KEY (iid)) ENGINE = InnoDB";
                $this->connection->exec($query);
                return true;
            } catch (PDOException $e) {
                echo "error: " .  $e->getMessage();
            }
        }
        return false;
    }
    public function getAllPublicProjects()
    {
        /* This function returns all public projects in projects table */
        $query = "SELECT * FROM " . $this->table . " WHERE isPublic = 1";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = array(
                "pid" => $row['pid'],
                "name" => $row['name'],
                "description" => $row['description'],
                "creator_id" => $row['creator_id'],
                "admin_id" => $row['admin_id'],
                "team_id" => $row['team_id'],
                "is_public" => $row['isPublic'],
                "date_created" => $row['date_created']
            );
        }
        return $data;
    }

    public function getProjectBypid($pid)
    {
        if (!empty($pid)) {
            $query = "SELECT * FROM " . $this->table . " WHERE pid = ?";
            $stmt = $this->connection->prepare($query);
            $pid = htmlspecialchars(strip_tags($pid));
            $stmt->bindParam(1, $pid);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                return  array(
                    "pid" => $row['pid'],
                    "name" => $row['name'],
                    "description" => $row['description'],
                    "creator_id" => $row['creator_id'],
                    "admin_id" => $row['admin_id'],
                    "team_id" => $row['team_id'],
                    "is_public" => $row['isPublic'],
                    "date_created" => $row['date_created']
                );
            }
        }
        return null;
    }

    public function getProjectByName($name)
    {
        if (!empty($name)) {
            $query = "SELECT * FROM " . $this->table . " WHERE name = ? LIMIT 0, 1";
            $stmt = $this->connection->prepare($query);
            $name = htmlspecialchars(strip_tags($name));
            $stmt->bindParam(1, $name);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->pid = $row['pid'];
                $this->name = $row['name'];
                $this->creatorId = $row['creator_id'];
                $this->adminId = $row['admin_id'];
                $this->teamId = $row['team_id'];
                $this->dateCreated = $row['date_created'];
                $this->isPublic = $row['isPublic'];
                return true;
            }
        }
        return false;
    }

    public function updateProjectById($pid, $name)
    {
        if (!empty($pid) && !empty($name)) {
            $query = "UPDATE " . $this->table . " SET name = :name WHERE pid = :pid";
            $stmt = $this->connection->prepare($query);
            $pid = htmlspecialchars(strip_tags($pid));
            $name = htmlspecialchars(strip_tags($name));

            $stmt->bindParam(":name", $name);
            $stmt->bindParam(":pid", $pid);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->pid = $row['pid'];
                $this->name = $row['name'];
                $this->creatorId = $row['creator_id'];
                $this->adminId = $row['admin_id'];
                $this->teamId = $row['team_id'];
                $this->dateCreated = $row['date_created'];
                return true;
            }
        }
        return false;
    }

    public function changeAdmin($pid, $new_admin_id)
    {
        if (!empty($pid) && !empty($new_admin_id)) {
            $query = "UPDATE " . $this->table . " SET admin_id = :new_admin WHERE pid = :pid";
            $stmt = $this->connection->prepare($query);
            $pid = htmlspecialchars(strip_tags($pid));
            $new_admin_id = htmlspecialchars(strip_tags($new_admin_id));

            $stmt->bindParam(":new_admin", $new_admin_id);
            $stmt->bindParam(":pid", $pid);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->pid = $row['pid'];
                $this->name = $row['name'];
                $this->creatorId = $row['creator_id'];
                $this->adminId = $row['admin_id'];
                $this->teamId = $row['team_id'];
                $this->dateCreated = $row['date_created'];
                return true;
            }
        }
        return false;
    }

    public function deleteProjectById($pid)
    {
        if (!empty($pid)) {
            $query = "DELETE FROM " . $this->table . " WHERE pid = ?";
            $stmt = $this->connection->prepare($query);
            $pid = htmlspecialchars(strip_tags($pid));
            $stmt->bindParam(1, $pid);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                return true;
            }
        }
        return false;
    }

    public function deleteProjectWithTable($pid)
    {
        if (!empty($pid)) {
            try {
                if ($this->deleteProjectById($pid)) {
                    $sql = "DROP TABLE " . "project_" . $pid;
                    $this->connection->exec($sql);
                    return true;
                }
            } catch (PDOException $e) {
                echo "error: " . $e->getMessage();
            }
        }
        return false;
    }
}
