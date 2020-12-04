<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


require_once "../config/db.php";
require_once "./project.php";
require_once "../users/token_validation.php";

$_db = new Database();
$db = $_db->connect();

$token = new Token();

$project = new Project($db);

$data = json_decode(file_get_contents('php://input'));

$projectData = null;

if (
    !empty($data->token) &&
    !empty($data->uid) &&
    !empty($data->filter)
    && $token->validJWT($data->uid, $data->token)
) {
    if ($data->filter === "ALL") {
        $publicProjectData = $project->getAllPublicProjects();

        $projectData = $publicProjectData; // for tempory
    } else {
        if ($data->filter === "PRIVATE") {
        } else {  // public
            $projectData = $project->getAllPublicProjects();
        }
    }
    echo json_encode(array("success" => true, "msg" => "Data fetched successfully", "project_data" => $projectData));
} else {
    echo json_encode(array("success" => false, "msg" => "Unauthorized"));
}
