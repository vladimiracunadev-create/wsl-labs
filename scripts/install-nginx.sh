#!/usr/bin/env bash
# wsl-labs · Instalación y configuración de NGINX en el puerto 8080 (idempotente)
# Fuente de verdad: labs.config.json (nginx = 8080).
set -euo pipefail

SERVICIO="nginx"
PUERTO=8080

# Raíz del repo: 2 niveles por encima de este script (scripts/ -> repo/)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONF_ORIGEN="${REPO_ROOT}/labs/05-servidor-web-nginx/nginx-wsl-labs.conf"
SITE_HTML_ORIGEN="${REPO_ROOT}/examples/nginx-site/index.html"

# --- 1) Instalar nginx solo si no está (idempotente) ------------------------
if command -v nginx >/dev/null 2>&1; then
  echo "[wsl-labs] nginx ya instalado; se omite apt."
else
  echo "[wsl-labs] Instalando nginx..."
  sudo apt-get update
  sudo apt-get install -y nginx
fi

# --- 2) Desplegar el sitio de ejemplo ---------------------------------------
sudo mkdir -p /var/www/wsl-labs
if [ -f "$SITE_HTML_ORIGEN" ]; then
  sudo cp "$SITE_HTML_ORIGEN" /var/www/wsl-labs/index.html
else
  # Fallback: página mínima si el ejemplo no está en el repo
  echo "<h1>wsl-labs</h1><p>Nginx en WSL (:8080)</p>" | sudo tee /var/www/wsl-labs/index.html >/dev/null
fi

# --- 3) Desplegar la conf de 8080 (idempotente) -----------------------------
sudo cp "$CONF_ORIGEN" /etc/nginx/sites-available/wsl-labs
# ln -sf recrea el symlink sin fallar si ya existía
sudo ln -sf /etc/nginx/sites-available/wsl-labs /etc/nginx/sites-enabled/wsl-labs

# Quitar el site default si colisiona (escucha en 80 y sobra para este lab)
if [ -e /etc/nginx/sites-enabled/default ]; then
  echo "[wsl-labs] Quitando el site 'default' de nginx para evitar colisiones."
  sudo rm -f /etc/nginx/sites-enabled/default
fi

# Validar la sintaxis antes de recargar
sudo nginx -t

# --- 4) Recargar el servicio (reload; si falla, restart) --------------------
sudo service nginx reload || sudo service nginx restart

# --- 5) Verificación real por HTTP ------------------------------------------
if curl -fsS "http://localhost:${PUERTO}" >/dev/null; then
  echo "[wsl-labs] ${SERVICIO} OK en :${PUERTO}"
else
  echo "[wsl-labs] ${SERVICIO} FALLO: no responde en http://localhost:${PUERTO}" >&2
  exit 1
fi
