<?php
header('Content-Type: application/json; charset=utf-8');
$host = getenv('DB_HOST') ?: 'wslc-mariadb';
$reachable = false;
$conn = @fsockopen($host, 3306, $errno, $errstr, 2);
if ($conn) { $reachable = true; fclose($conn); }
echo json_encode([
  'project' => 'wsl-labs',
  'case' => '02-php-lamp',
  'engine' => 'wslc',
  'php' => phpversion(),
  'mariadb' => $reachable ? 'reachable' : 'sin conexión',
  'dbHost' => $host,
]);
