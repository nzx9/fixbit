<?php

class User
{

    private $connection;
    private $table = "users";

    private $uid;
    private $firstname;
    private $lastname;
    private $email;
    private $password;

    public function __construct($db)
    {
        $this->connection = $db;
    }

    public function setId($uid)
    {
        $this->uid = $uid;
    }

    public function setFirstName($firstname)
    {
        $this->firstname = $firstname;
    }

    public function setLastName($lastname)
    {
        $this->lastname = $lastname;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function getId()
    {
        return $this->uid;
    }

    public function getFirstName()
    {
        return $this->firstname;
    }

    public function getLastName()
    {
        return $this->lastname;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function emailNotExist()
    {
        $query = "SELECT uid FROM " . $this->table . " WHERE email = ? LIMIT 0,1";
        $stmt = $this->connection->prepare($query);

        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return false;
        }
        return true;
    }

    public function create()
    {
        if (
            !empty($this->firstname) &&
            !empty($this->lastname) &&
            !empty($this->email) &&
            !empty($this->password) &&
            $this->emailNotExist()
        ) {

            $query = "INSERT INTO " . $this->table . "(firstname, lastname, email, password) VALUES (:firstname, :lastname, :email, :password)";

            $stmt = $this->connection->prepare($query);

            $this->firstname = htmlspecialchars(strip_tags($this->firstname));
            $this->lastname = htmlspecialchars(strip_tags($this->lastname));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->password = htmlspecialchars(strip_tags($this->password));
            $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

            $stmt->bindParam(":firstname", $this->firstname);
            $stmt->bindParam(":lastname", $this->lastname);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":password", $password_hash);

            if ($stmt->execute()) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->uid = $row['uid'];
                return true;
            }

            return false;
        }
    }

    public function validateLoginCredentials($email, $password)
    {
        if (!empty($email) && !empty($password)) {
            $query = "SELECT * FROM " . $this->table . " WHERE email = ? LIMIT 0,1";
            $stmt = $this->connection->prepare($query);
            $this->email = htmlspecialchars(strip_tags($email));
            $stmt->bindParam(1, $email);
            $stmt->execute();



            if ($stmt->rowCount() == 1) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $password_ok = password_verify($password, $row['password']);
                if ($password_ok) {
                    $this->uid = $row['uid'];
                    $this->firstname = $row['firstname'];
                    $this->lastname = $row['lastname'];
                    $this->email = $row['email'];
                    return true;
                }
            }
        }
        return false;
    }

    public function getUserDetailsById($uid)
    {
        if (!empty($uid)) {
            $query = "SELECT * FROM " . $this->table . " WHERE uid = ? LIMIT 0,1";
            $stmt = $this->connection->prepare($query);
            $this->uid = htmlspecialchars(strip_tags($uid));
            $stmt->bindParam(1, $uid);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->firstname = $row['firstname'];
                $this->lastname = $row['lastname'];
                $this->email = $row['email'];
                return true;
            }
        }
        return false;
    }

    public function getUserDetailsByEmail($email)
    {
        if (!empty($email)) {
            $query = "SELECT * FROM " . $this->table . " WHERE email = ? LIMIT 0,1";
            $stmt = $this->connection->prepare($query);
            $this->email = htmlspecialchars(strip_tags($email));
            $stmt->bindParam(1, $email);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->uid = $row['uid'];
                $this->firstname = $row['firstname'];
                $this->lastname = $row['lastname'];
                return true;
            }
        }
        return false;
    }

    // public function updateUserDetailsById($uid)
    // {
    //     if (!empty($uid) && !empty($this->firstname) && !empty($this->lastname)) {
    //         $query = "UPDATE " . $this->table . "SET
    //                     firstname = :firstname,
    //                     lastname = :lastname
    //                     WHERE uid = :uid LIMIT 0,1";
    //         $stmt = $this->connection->prepare($query);
    //         $uid = htmlspecialchars(strip_tags($uid));
    //         $this->firstname = htmlspecialchars(strip_tags($this->firstname));
    //         $this->lastname = htmlspecialchars(strip_tags($this->lastname));

    //         $stmt->bindParam(":firstname", $this->firstname);
    //         $stmt->bindParam(":lastname", $this->lastname);
    //         $stmt->bindParam(":uid", $uid);

    //         if ($stmt->execute()) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
}
