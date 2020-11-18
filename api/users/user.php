<?php

class User
{

    private $connection;
    private $table = "users";

    private $uid;
    private $username;
    private $fullname;
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

    public function setUserName($username)
    {
        $this->username = $username;
    }

    public function setFullName($fullname)
    {
        $this->fullname = $fullname;
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

    public function getUserName()
    {
        return $this->username;
    }

    public function getFullName()
    {
        return $this->fullname;
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
            !empty($this->username) &&
            !empty($this->fullname) &&
            !empty($this->email) &&
            !empty($this->password) &&
            $this->emailNotExist()
        ) {

            $query = "INSERT INTO " . $this->table . "(username, fullname, email, password) VALUES (:username, :fullname, :email, :password)";

            $stmt = $this->connection->prepare($query);

            $this->username = htmlspecialchars(strip_tags($this->username));
            $this->fullname = htmlspecialchars(strip_tags($this->fullname));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->password = htmlspecialchars(strip_tags($this->password));
            $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

            $stmt->bindParam(":username", $this->username);
            $stmt->bindParam(":fullname", $this->fullname);
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
                    $this->username = $row['username'];
                    $this->fullname = $row['fullname'];
                    $this->email = $row['email'];
                    return true;
                }
            }
        }
        return false;
    }
    public function getEmailById($uid)
    {
        if (!empty($uid)) {
            $query = "SELECT email FROM " . $this->table . " WHERE uid = ? LIMIT 0,1";
            $stmt = $this->connection->prepare($query);
            $uid = htmlspecialchars(strip_tags($uid));
            $stmt->bindParam(1, $uid);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                return $row['email'];
            }
        }
        return null;
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
                $this->username = $row['username'];
                $this->fullname = $row['fullname'];
                return true;
            }
        }
        return false;
    }

    public function verifyEmailById($uid, $email)
    {
        if (!empty($uid) && !empty($email)) {
            $query = "SELECT uid FROM " . $this->table . " WHERE email = ? AND uid = ? LIMIT 0,1";
            $stmt = $this->connection->prepare($query);
            $uid = htmlspecialchars(strip_tags($uid));
            $stmt->bindParam(1, $email);
            $stmt->bindParam(2, $uid);
            $stmt->execute();

            if ($stmt->rowCount() == 1) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $uid_db = $row['uid'];
                if ($uid_db === $uid) {
                    return true;
                }
            }
        }
        return false;
    }

    public function updateUserDetails($uid, $username, $fullname, $email)
    {
        if (!empty($uid) && !empty($username) && !empty($fullname) && !empty($email)) {
            $query = "UPDATE " . $this->table . " SET username = :username, fullname = :fullname, email = :email WHERE uid = :uid";
            $stmt = $this->connection->prepare($query);
            $uid = htmlspecialchars(strip_tags($uid));
            $username = htmlspecialchars(strip_tags($username));
            $fullname = htmlspecialchars(strip_tags($fullname));
            $email = htmlspecialchars(strip_tags($email));

            $stmt->bindParam(":username", $username);
            $stmt->bindParam(":fullname", $fullname);
            $stmt->bindParam(":email", $email);
            $stmt->bindParam(":uid", $uid);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $this->setId($uid);
                $this->setUserName($username);
                $this->setFullName($fullname);
                $this->setEmail($email);
                return true;
            }
        }
        return false;
    }

    public function changePassword($uid, $newPassword)
    {
        if (!empty($uid) && !empty($newPassword)) {
            $query = "UPDATE " . $this->table . " SET password = :hash_password WHERE uid = :uid";
            $stmt = $this->connection->prepare($query);
            $uid = htmlspecialchars(strip_tags($uid));
            $newPassword = htmlspecialchars(strip_tags($newPassword));

            $stmt->bindParam(":hash_password", password_hash($newPassword, PASSWORD_BCRYPT));
            $stmt->bindParam(":uid", $uid);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $this->setId($uid);
                return true;
            }
        }
        return false;
    }
}
