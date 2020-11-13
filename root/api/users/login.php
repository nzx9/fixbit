<?php 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


include_once "../config/db.php";
include_once "./user.php";

$_db = new Database();
$db = $_db -> connect();

$user = new User($db);

$data = json_decode(file_get_contents('php://input'));

$isLoginCredentialsValid = $user -> validateLoginCredentials($data -> email, $data -> password);


if($isLoginCredentialsValid) {
    http_response_code(200);
    $user_data = array("uid" => $user -> getId(), 
                       "firstname" => $user -> getFirstName(), 
                       "lastname" => $user -> getLastName(), 
                       "email" => $user -> getEmail());
    echo json_encode(array(success => true, msg => "Valid Login Credintials.", user_data => $user_data));
} else {
    http_response_code(200);
    echo json_encode(array(success => false, msg => "Invalid Login Credintails.", user_data => null));
}

?>
