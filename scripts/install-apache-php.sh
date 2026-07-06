#!/usr/bin/env bash
# wsl-labs · Instalación y configuración de Apache + PHP en el puerto 8081 (idempotente)
# Fuente de verdad: labs.config.json (apache = 8081).
set -euo pipefail

SERVICIO="apache"
PUERTO=8081

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONF_ORIGEN="${REPO_ROOT}/labs/06-servidor-apache-php/apache-wsl-php.conf"
SITE_PHP_ORIGEN="${REPO_ROOT}/examples/apache-php-site/index.php"

# --- 1) Instalar apache2 + php solo si faltan (idempotente) -----------------
PAQUETES=(apache2 php libapache2-mod-php)
FALTAN=()
for pkg in "${PAQUETES[@]}"; do
  if ! dpkg -s "$pkg" >/dev/null 2>&1; then
    FALTAN+=("$pkg")
  fi
done
if [ "${#FALTAN[@]}" -eq 0 ]; then
  echo "[wsl-labs] apache2 + php ya instalados; se omite apt."
else
  echo "[wsl-labs] Instalando: ${FALTAN[*]}"
  sudo apt-get update
  sudo apt-get install -y "${FALTAN[@]}"
fi

# --- 2) Asegurar que Apache escucha en 8081 (idempotente) -------------------
# Un VirtualHost no basta: hace falta la directiva Listen. La añadimos a
# ports.conf solo si no existe ya, para no duplicarla en ejecuciones repetidas.
if ! grep -qE '^\s*Listen\s+8081\b' /etc/apache2/ports.conf; then
  echo "[wsl-labs] Añadiendo 'Listen 8081' a /etc/apache2/ports.conf"
  echo "Listen 8081" | sudo tee -a /etc/apache2/ports.conf >/dev/null
else
  echo "[wsl-labs] 'Listen 8081' ya presente en ports.conf."
fi

# --- 3) Desplegar el ejemplo PHP --------------------------------------------
sudo mkdir -p /var/www/wsl-php
if [ -f "$SITE_PHP_ORIGEN" ]; then
  sudo cp "$SITE_PHP_ORIGEN" /var/www/wsl-php/index.php
else
  echo "<?php echo 'wsl-labs · Apache+PHP en :8081';" | sudo tee /var/www/wsl-php/index.php >/dev/null
fi

# --- 4) Desplegar y activar el VirtualHost 8081 (idempotente) ---------------
sudo cp "$CONF_ORIGEN" /etc/apache2/sites-available/wsl-php.conf
# a2ensite es idempotente (si ya está activo no falla)
sudo a2ensite wsl-php.conf

# Validar la configuración antes de recargar
sudo apache2ctl configtest

# --- 5) Recargar el servicio (reload; si falla, restart) --------------------
sudo service apache2 reload || sudo service apache2 restart

# --- 6) Verificación real por HTTP ------------------------------------------
if curl -fsS "http://localhost:${PUERTO}" >/dev/null; then
  echo "[wsl-labs] ${SERVICIO} OK en :${PUERTO}"
else
  echo "[wsl-labs] ${SERVICIO} FALLO: no responde en http://localhost:${PUERTO}" >&2
  exit 1
fi
