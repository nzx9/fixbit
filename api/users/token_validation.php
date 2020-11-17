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
            "iat" => time() + (60 * 60),
            "nbf" => time(),
        );
        $jwt = JWT::encode($payload, $this->key);
        return $jwt;
    }

    public function decode($jwt)
    {
        $decoded_data = JWT::decode($jwt, $this->key, array($this->v_algo));
        return $decoded_data;
    }
}
