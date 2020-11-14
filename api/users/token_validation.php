<?php
require '../vendor/autoload.php';

use \Firebase\JWT\JWT;

// $key = "example_key";



class Token
{
    private $key = "hello_world";
    private $v_algo = 'HS256';

    public function __construct($time = 60)
    {
        JWT::$leeway = $time; // leeway time in seconds (default = 60s)
    }

    public function generate($payload)
    {
        // $payload = array(
        //     "iss" => "http://example.org",
        //     "aud" => "http://example.com",
        //     "iat" => 1356999524,
        //     "nbf" => 1357000000,
        // );
        $jwt = JWT::encode($payload, $this->key);
        return $jwt;
    }

    public function decode($jwt)
    {
        $decoded_data = JWT::decode($jwt, $this->key, array($this->v_algo));
        return $decoded_data;
    }
}
