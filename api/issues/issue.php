<?php

class Issue
{
    private $connection;
    private $table;

    public $iid;
    public $title;
    public $description;
    public $attachments;
    public $createdBy;
    public $assignedTo;
    public $type;
    public $priority;
    public $isOpen;
    public $comments;
    public $dateCreated;

    public function __construct($db, $pid)
    {
        $this->connection = $db;
        $this->table = "project_" . $pid;
    }


    public function create()
    {
        /*  This function create new issue in given table 
            parmas : None
            return : Boolean 
        */
        if (
            !empty($this->title) &&
            !empty($this->description) &&
            !empty($this->createdBy) &&
            !empty($this->type) &&
            !empty($this->priority)
        ) {
            $query = "INSERT INTO " . $this->table . "(title, description, createdBy, type, priority, isOpen, assignedTo) 
                                               VALUES (:title, :description, :createdBy, :type, :priority, :isOpen, :assignedTo)";

            $stmt = $this->connection->prepare($query);

            $this->title = htmlspecialchars(strip_tags($this->title));
            $this->description = htmlspecialchars(strip_tags($this->description));
            $this->createdBy = htmlspecialchars(strip_tags($this->createdBy));
            $this->type = htmlspecialchars(strip_tags($this->type));
            $this->priority = htmlspecialchars(strip_tags($this->priority));
            $this->isOpen = htmlspecialchars(strip_tags($this->isOpen));
            $this->assignedTo = htmlspecialchars(strip_tags($this->assignedTo));

            $stmt->bindParam(":title", $this->title);
            $stmt->bindParam(":description", $this->description);
            $stmt->bindParam(":createdBy", $this->createdBy);
            $stmt->bindParam(":priority", $this->priority);
            $stmt->bindParam(":isOpen", $this->isOpen);
            $stmt->bindParam(":type", $this->type);
            $stmt->bindParam(":assignedTo", $this->assignedTo);


            if ($stmt->execute()) {
                $this->iid = $this->connection->lastInsertId();
                return true;
            }
        }
        return false;
    }

    public function getAll()
    {
        /*  This function returns all issues in given table
            parmas : None
            return : data of all issues
        */
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = array(
                "iid" => $row['iid'],
                "title" => $row['title'],
                "assignedTo" => $row['assignedTo'],
                "priority" => $row['priority'],
                "isOpen" => $row['isOpen'],
                "type" => $row['type']
            );
        }
        return $data;
    }

    public function getIssue($iid)
    {
        /*  This function take issue_id as an argument and return the data of given issue id in given table
            params : iid
            return : issue data
        */
        if (!empty($iid)) {
            $query = "SELECT * FROM " . $this->table . " WHERE iid = ?";
            $stmt = $this->connection->prepare($query);

            $iid = htmlspecialchars(strip_tags($iid));
            $stmt->bindParam(1, $iid);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }
}
