<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

/*  This file is used for validate login credentilas and issue tokens, 
    Method   : POST
    request  : email and password are required
    response : Error or if success user data and token
*/


include_once "../config/db.php";
include_once "./user.php";
include_once "./token_validation.php";

$_db = new Database();
$db = $_db->connect();

$user = new User($db);
$token = new Token();

$data = json_decode(file_get_contents('php://input'));

$isLoginCredentialsValid = $user->validateLoginCredentials($data->email, $data->password);


if ($isLoginCredentialsValid) {
    http_response_code(200);
    $user_data = array(
        "uid" => $user->getId(),
        "username" => $user->getUserName(),
        "fullname" => $user->getFullName(),
        "email" => $user->getEmail(),
        "token" => $token->generate($user->getId())
    );
    echo json_encode(array("success" => true, "msg" => "Valid Login Credintials.", "user_data" => $user_data));
} else {
    http_response_code(200);
    echo json_encode(array("success" => false, "msg" => "Invalid Login Credintails.", "user_data" => null));
}
