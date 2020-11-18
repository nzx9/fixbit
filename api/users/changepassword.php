<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once "../config/db.php";
include_once "./user.php";
include_once "./token_validation.php";

$_db = new Database();
$db = $_db->connect();

$user = new User($db);
$token = new Token();

$data = json_decode(file_get_contents('php://input'));



if (!empty($data->token) && $token->decode($data->token)->uid == $data->uid) {
    $email = $user->getEmailById($data->uid);
    if ($email !== null) {
        $is_valid = $user->validateLoginCredentials($email, $data->currentPassword);
        if ($is_valid) {
            if (!empty($data->newPassword) && ($data->newPassword === $data->confirmNewPassword)) {
                $success = $user->changePassword($data->uid, $data->newPassword);
                if ($success) {
                    http_response_code(200);
                    echo json_encode(array("success" => true, "msg" => "Password Changed Success", "user_data" => null, "type" => "success"));
                } else {
                    http_response_code(200);
                    echo json_encode(array("success" => false, "msg" => "Nothing to Change", "user_data" => null, "type" => "warning"));
                }
            } else {
                http_response_code(200);
                echo json_encode(array("success" => false, "msg" => "Passwords are not matched", "user_data" => null, "type" => "error"));
            }
        } else {
            http_response_code(200);
            echo json_encode(array("success" => false, "msg" => "Current Password is incorrect", "user_data" => null, "type" => "error"));
        }
    } else {
        http_response_code(200);
        echo json_encode(array("success" => false, "msg" => "Unauthorized", "user_data" => null, "type" => "error"));
    }
} else {
    http_response_code(200);
    echo json_encode(array("success" => false, "msg" => "Unauthorized", "user_data" => null, "type" => "error"));
}
