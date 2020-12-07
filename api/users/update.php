<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

/*  This file is used for update user details, 
    Method   : POST
    request  : uid, token and new user deatils are required
    response : Error or success
*/

include_once "../config/db.php";
include_once "./user.php";
include_once "./token_validation.php";

$_db = new Database();
$db = $_db->connect();

$user = new User($db);
$token = new Token();

$data = json_decode(file_get_contents('php://input'));


$decoded_data = $token->decode($data->token);
if ($decoded_data->uid == $data->uid) {
    $user->setEmail($data->email);
    if ($user->emailNotExist() || $user->verifyEmailById($data->uid, $data->email)) {
        $success = $user->updateUserDetails($data->uid, $data->username, $data->fullname, $data->email);
        if ($success) {
            http_response_code(200);
            $user_data = array(
                "uid" => $user->getId(),
                "username" => $user->getUserName(),
                "fullname" => $user->getFullName(),
                "email" => $user->getEmail()
            );
            echo json_encode(array("success" => true, "msg" => "Update Success", "user_data" => $user_data, "type" => "success"));
        } else {
            echo json_encode(array("success" => false, "msg" => "Nothing to Update", "user_data" => null, "type" => "warning"));
        }
    } else {
        http_response_code(200);
        echo json_encode(array("success" => false, "msg" => "New email already exist in another account", "user_data" => null, "type" => "error"));
    }
} else {
    http_response_code(401);
    echo json_encode(array("success" => false, "msg" => "Unauthorized", "user_data" => null, "type" => "error"));
}
