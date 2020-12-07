<?php
require '../vendor/autoload.php'; // import Firebase JWT

use \Firebase\JWT\JWT;

class Token
{
    private $key = "hello_world";
    private $site_url = "http://localhost";

    public function __construct($time = 60)
    {
        JWT::$leeway = $time; // leeway time in seconds (default = 60s)
    }

    public function generate($uid)
    {
        /*  This function generate JWT token
            params : uid
            return : JWT Token
        */
        $payload = array(
            "iss" => $this->site_url,
            "uid" => $uid,
            "iat" => time(),
            "exp" => time() + (60 * 60), // 1 hour
            "nbf" => 1605603296,  // 2020-11-17T14.25+05.30
        );
        $jwt = JWT::encode($payload, $this->key);
        return $jwt;
    }

    public function decode($jwt)
    {
        /*  This function decode JWT tokens
            params : token
            return : decoded data
        */
        try {
            $decoded_data = JWT::decode($jwt, $this->key, array('HS256'));;
            return $decoded_data;
        } catch (\Exception $error) {
            echo "$error";
        }
    }

    public function validJWT($uid, $jwt)
    {
        /*  This function validate tokens with uid
            params : uid and token
            return : Boolean
        */
        try {
            $decoded_data = JWT::decode($jwt, $this->key, array('HS256'));
            if (
                $decoded_data->exp >= time() &&
                $decoded_data->iss == $this->site_url &&
                $decoded_data->uid == $uid
            ) {
                return true;
            } else {
                return false;
            }
        } catch (\Exception $error) {
            return false;
        }
    }
}
