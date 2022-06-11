<?php

require __DIR__ . '/../vendor/autoload.php';

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Dotenv\Dotenv;
use Tarik02\PccontrolWeb\Controller;

$dotenv = new Dotenv();
$dotenv->usePutenv();
$dotenv->load(__DIR__ . '/../.env');

$request = Request::createFromGlobals();

$controller = new Controller();

$response = $controller->handle($request);

$response->send();
