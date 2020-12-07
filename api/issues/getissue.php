<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

/*  This file is used for request one issue, 
    Method   : POST
    request  : iid, pid, token and uid are required
    response : data of given iid in given pid
*/


include_once "../config/db.php";
include_once "../users/token_validation.php";
include_once "./issue.php";


$_db = new Database();
$db = $_db->connect();

$token = new Token();

$data = json_decode(file_get_contents('php://input'));

if (
    !empty($data->pid) &&
    !empty($data->token) &&
    !empty($data->uid) &&
    !empty($data->iid) &&
    $token->validJWT($data->uid, $data->token)
) {
    $issue = new Issue($db, $data->pid);
    http_response_code(200);
    echo json_encode(array("success" => true, "data" => $issue->getIssue($data->iid)));
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "msg" => "Unauthorized"));
}
