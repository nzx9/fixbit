<?php 

class Database {
    private $host = "sql12.freemysqlhosting.net";
    private $dbname = "sql12376296"; 
    private $user = "sql12376296";
    private $passwd = "7XTpngHB4z";
    private $port = "3306";
    
    public $connection;

    public function connect(){
        $this -> connection = null;
        
        try {
            $this -> connection = new PDO("mysql:host=" . $this -> host . ";dbname=" . $this -> dbname, $this -> user, $this -> passwd);
        }
        catch(PDOException $e) {
            echo "Error(Connection):: " . $e -> getMessage(); 
        }
        return $this -> connection;
    }
}


?>
