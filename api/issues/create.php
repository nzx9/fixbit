<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

/*  This file is used for issue creating API calls, 
    Method   : POST
    Request  : uid, pid, token, title, decription, createdBy, priority and type are required
    Response : Success or Error
*/

include_once "../config/db.php";
include_once "../users/token_validation.php";
include_once "./issue.php";


$_db = new Database();
$db = $_db->connect();

$token = new Token();

$data = json_decode(file_get_contents('php://input'));

if (
    !empty($data->uid) &&
    !empty($data->pid) &&
    !empty($data->token) &&
    !empty($data->title) &&
    !empty($data->description) &&
    !empty($data->createdBy) &&
    !empty($data->priority) &&
    !empty($data->type)
    && $token->validJWT($data->uid, $data->token)
) {
    $issue = new Issue($db, $data->pid);
    $issue->title = $data->title;
    $issue->description = $data->description;
    $issue->isOpen = $data->isOpen;
    $issue->createdBy = $data->createdBy;
    $issue->priority = $data->priority;
    $issue->type = $data->type;
    $issue->assignedTo = $data->assignedTo;

    if ($issue->create()) {
        http_response_code(200);
        echo json_encode(array("success" => true, "msg" => "Issues Created Successfuly"));
    } else {
        http_response_code(200);
        echo json_encode(array("success" => false, "msg" => "Issues Creation Failed. Try again"));
    }
} else {
    http_response_code(200);
    echo json_encode(array("success" => false, "msg" => "Unauthorized"));
}
