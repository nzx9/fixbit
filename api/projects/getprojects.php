<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


require_once "../config/db.php";
require_once "./project.php";
require_once "../op_support/op_support.php";
require_once "../users/token_validation.php";

$_db = new Database();
$db = $_db->connect();

$token = new Token();

$project = new Project($db);
$op_support = new OpSupport($db);

$data = json_decode(file_get_contents('php://input'));

$projectData = null;

if (
    !empty($data->token) &&
    !empty($data->uid) &&
    !empty($data->filter)
    && $token->validJWT($data->uid, $data->token)
) {
    if ($data->filter === "ALL") {
        $all_project_ids = $op_support->getProjectsByUser($data->uid, 1);
        foreach ($all_project_ids as $pid_info) {
            $project_data[] = $project->getProjectBypid($pid_info['pid']);
        }
        $projectData = $project_data;
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
