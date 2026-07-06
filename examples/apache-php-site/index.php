<?php
$fecha = date('Y-m-d H:i:s');
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>wsl-labs - Apache PHP</title>
</head>
<body>
  <h1>wsl-labs</h1>
  <p>Apache + PHP funcionando dentro de WSL.</p>
  <p>Fecha del servidor: <?= htmlspecialchars($fecha, ENT_QUOTES, 'UTF-8') ?></p>
</body>
</html>
