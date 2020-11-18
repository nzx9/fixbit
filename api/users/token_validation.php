<?php
require '../vendor/autoload.php';

use \Firebase\JWT\JWT;

class Token
{
    private $key = "hello_world";
    private $v_algo = 'HS256';
    private $site_url = "http://localhost";

    public function __construct($time = 60)
    {
        JWT::$leeway = $time; // leeway time in seconds (default = 60s)
    }

    public function generate($uid)
    {
        $payload = array(
            "iss" => $this->site_url,
            "uid" => $uid,
            "iat" => time(),
            "exp" => time() + (60 * 60 * 24), // 1 day
            "nbf" => 1605603296,  // 2020-11-17T14.25+05.30
        );
        $jwt = JWT::encode($payload, $this->key);
        return $jwt;
    }

    public function decode($jwt)
    {
        try {
            $decoded_data = JWT::decode($jwt, $this->key, array('HS256'));;
            return $decoded_data;
        } catch (\Exception $error) {
            echo "$error";
        }
    }
}
