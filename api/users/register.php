<?php 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


include_once "../config/db.php";
include_once "./user.php";

$_db = new Database();
$db = $_db -> connect();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

$user -> setEmail($data -> email);

$isEmailNotExist = $user -> emailNotExist();

$isPasswordAndCPasswordMatch = (!empty($data -> c_password) && $data -> password == $data -> c_password) ? true: false;

if($isEmailNotExist && $isPasswordAndCPasswordMatch) {
    $user -> setFirstName($data -> firstname);
    $user -> setLastName($data -> lastname);
    $user -> setEmail($data -> email);
    $user -> setPassword($data -> password);
    $isCreated = $user -> create();

    if($isCreated) {
        http_response_code(200);
        echo json_encode(array("success" => true, "msg" => "User Registed Successfully."));
    } else {
        http_response_code(200);
        echo json_encode(array("success" => false, "msg" => "User Registration Falied"));
    }
} else {
    http_response_code(200);
    echo json_encode(array("success" => false, "msg" => "Email already Exist. Please login."));
}
